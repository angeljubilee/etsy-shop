import React from 'react';

export default function Home(props) {
  const itemList = props.stock.items.map(item => {
    return (
      <li key={item.itemId}>
        <div className="hide-on-med-and-up">
          <div className="col s6">
            <div className="card small">
              <div className="card-image">
                <img src={item.url} />
              </div>
              <div className="card-stacked">
                <div className="card-content">
                  <section>
                    <h6>{item.title.slice(0, 35)}...</h6>
                    <div className="bold-text">
                      ${item.price}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hide-on-small-only">
          <div className="col m3">
            <div className="card medium">
              <div className="card-image">
                <img src={item.url} />
              </div>
              <div className="card-content">
                <section>
                  <div className="row">
                    <div className="col s12">
                      <h6>{item.title.slice(0, 54)}...</h6>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s6 bold-text">
                      ${item.price}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </li>);
  });

  return (
    props.stock.isLoading
      ? <div className="preloader-wrapper active">
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
      : <div className="container">
          <ul className="row">
            {itemList}
          </ul>
        </div>
  );
}
