import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PaypalButton from '../components/paypal';
import CartItem from '../components/cartItem';
import Email from '../email';

const styles = {
  show: {
    display: 'block'
  },
  hide: {
    display: 'none'
  }
};

export default class Cart extends React.Component {

  constructor(props) {
    super(props);
    this.handleClickClose = this.handleClickClose.bind(this);
    this.guestCheckout = this.guestCheckout.bind(this);
    this.handleOrder = this.handleOrder.bind(this);
    this.state = {
      showPaypal: false,
      loading: false,
      error: false
    };
  }

  handleClickClose(event) {
    const $li = event.target.closest('li');
    const itemId = $li.getAttribute('data-view');
    this.props.removeItem(parseInt(itemId));
  }

  guestCheckout(event) {
    this.setState({ showPaypal: true });
  }

  handleOrder(id, name, email) {
    this.setState({ loading: true });

    const items = this.props.cart;
    const newOrder = {
      transactionId: id,
      userId: 1,
      items: items
    };

    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newOrder)
    })
      .then(res => res.json())
      .then(data => {
        const orderId = data.orderId;
        const content = ReactDOMServer.renderToStaticMarkup(<Email orderId={orderId} items={items}/>);

        const emailData = {
          name: name,
          email: email,
          orderId: orderId,
          html: content
        };
        fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailData)
        }).then(res => res.json())
          .then(msgStatus => {
            if (msgStatus.msg === 'success') {
              this.setState({ loading: false });
              this.props.resetCart();
              window.location.hash = `order?orderId=${data.orderId}`;
            } else if (msgStatus.msg === 'fail') {
              console.error('Failed to send confirmation email');
              window.location.hash = 'error';
            }
          })
          .catch(err => {
            console.error(err);
            window.location.hash = 'error';
          });
      })
      .catch(err => {
        console.error(err);
        window.location.hash = 'error';
      });
  }

  render() {

    const subtotal = this.props.cart.reduce((acc, item) => {
      return acc + parseInt(item.price);
    }, 0);
    const shipping = 3.99;
    const total = (subtotal + shipping).toFixed(2);

    const checkinStyle = this.state.showPaypal ? styles.hide : styles.display;
    const paypalStyle = this.state.showPaypal ? styles.display : styles.hide;

    const cartStyle = this.state.loading ? styles.hide : styles.display;
    const loadingStyle = this.state.loading ? styles.display : styles.hide;

    return (
      this.props.cart.length
        ? <>
            <div className="flex-container" style={loadingStyle}>
              <div className="preloader-wrapper active">
                <div className="spinner-layer spinner-red-only">
                  <div className="circle-clipper left">
                    <div className="circle"></div>
                  </div><div className="gap-patch">
                    <div className="circle"></div>
                  </div><div className="circle-clipper right">
                    <div className="circle"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container" style={cartStyle}>
              <div className="row">
                <div className="col s12">
                  <h5 className="bold-text">Your Shopping bag</h5>
                </div>
              </div>
              <div className="row">
                <div className="col s12 m7">
                  <ul>
                    <CartItem cart={this.props.cart} handleClose={this.handleClickClose} />
                  </ul>
                </div>
                <div className="col m1"></div>
                <div className="col s12 m4">
                  <div className="row">
                    <h6 className="bold-text">Order Summary</h6>
                  </div>
                  <div className="row">
                    <div className="col s6">
                      Subtotal
                    </div>
                    <div className="col s6 right-align">
                      ${subtotal.toFixed(2)}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s6 ">
                      Subtotal
                    </div>
                    <div className="col s6 right-align">
                      ${subtotal}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s6">
                      Shipping
                    </div>
                    <div className="col s6 right-align">
                      ${shipping}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s6">
                      <h6 className="bold-text">Order total ({this.props.cart.length} items)</h6>
                    </div>
                    <div className="col s6 right-align">
                      <p className="bold-text">${total}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12 m6 right" style={checkinStyle}>
                      <button>Login to checkout</button>
                      <button className="orange margin-top-1" onClick={this.guestCheckout}>
                        Checkout as Guest
                      </button>
                    </div>
                  </div>
                  <div style={paypalStyle}>
                    <PaypalButton numItems={this.props.cart.length}
                      total={total}
                      newOrder={this.handleOrder}/>
                  </div>
                </div>
              </div>
            </div>
          </>
        : <div className="container">
         <div className="col s12">
           No items in your cart.
         </div>
       </div>
    );
  }
}
