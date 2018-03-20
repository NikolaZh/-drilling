import React, { Component } from 'react';

class CardProject extends Component {
    constructor(props) {
        super();
        this.props = props;
        this.state = {
            Obj: props.Obj,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            Obj: nextProps.Obj,
        });
    }

    render() {
        const options = {
            day: 'numeric',
            year: 'numeric',
            month: 'numeric',
        };


        Object.defineProperty(this.state.Obj, 'owns', {
            enumerable: false,
        });


        return (
          <div className="card" >
            <div className="card-body card-content-small">
              {Object.keys(this.state.Obj.fields).map((el, i) => {
                if (el === 'name') {
                   return <h5 className="card-title" key={el}>{this.state.Obj.fields[el].toString()}</h5>;
                }
                if (el === 'date1' || el === 'date2') {
                      return <h6 className="card-subtitle mb-2 text-muted" key={el}>{this.state.Obj.fields[el].toLocaleString('ru', options)}</h6>;
                    }
                    return <h6 className="card-subtitle mb-2 text-muted" key={el}>{this.state.Obj.fields[el]}</h6>;
              })}

              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <h6 className="card-subtitle mb-2 text-muted"> Заняты на проекте: </h6>
                </li>
                {Object.keys(this.state.Obj.fields.owns).map((item, i) => (
                  <li className="list-group-item">
                    {Object.keys(item).map((el) => {
                        if (el === 'dateStart' || el === 'dateEnd') {
                            return <h6 className="card-subtitle mb-2 text-muted"> {(new Date(item[el])).toLocaleString('ru', options)} </h6>;
                        }
                        return <h6 className="card-subtitle mb-2 text-muted"> {item[el]} </h6>;
                    })}
                  </li>
                  ))}
              </ul>

            </div>
            <div className="card-body" key={this.props.key}>
              <a href="#" className="card-link text-info" key={this.props.key}><span className="oi oi-pencil" key={this.props.key} /> Edit</a>
              <a href="#" className="card-link text-danger" key={this.props.key}><span className="oi oi-trash" key={this.props.key} /> Drop</a>
            </div>
          </div>
        );
    }
}


export default CardProject;
