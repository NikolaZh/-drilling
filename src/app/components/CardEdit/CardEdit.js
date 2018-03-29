import React, { Component } from 'react';
import CardTitle from '../CardInput/CardTitle/CardTitle';
import { storage } from '../../js/js-library';

class CardEdit extends Component {
    constructor(props) {
        super();
        this.props = props;
        this.state = {

        };
        this.state = this.stateFromProps(props.Obj.fields);
        this.state.cardInputMount = true;
        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.saveObject = this.saveObject.bind(this);
        this.changeMount = this.changeMount.bind(this);
    }

    stateFromProps(props) {
        Object.defineProperty(props, 'owns', {
            enumerable: false,
        });
        const state = Object.keys(props).reduce((obj, cur) => {
            if ((cur === 'date1' || cur === 'date2') && (typeof props[cur] !== 'string')) {
                obj[cur] = props[cur].toISOString().substr(0, 10);
            } else {
                obj[cur] = props[cur];
            }
            return obj;
        }, {});
        return state;
    }

    changeMount() {
        this.setState({
            cardInputMount: !this.state.cardInputMount,
        });
    }

    handleChangeForm(e) {
        const property = e.target.name;
        const val = e.target.value;
        this.setState({
            [property]: val,
        });
    }

    saveObject() {
        this.changeMount();
        const EditedObject = this.props.Obj;
        for (const key in this.state) {
            if (key !== 'cardInputMount') {
                EditedObject.fields[key] = this.state[key];
            }
        }
        storage.save(EditedObject);
    }

    render() {
        const data = this.props;
        let editForm = (
          <div className="card">
            <div className="card-body card-content-small text-primary" >
              <h6 className="card-subtitle mb-2">Successful Saved!</h6>
            </div>
            <div className="card-body">
              <a href="#" className="card-link text-info" onClick={() => data.changeData(data.Obj.constructor.name, true)}><span className="oi oi-check" /> OK</a>
            </div>
          </div>
        );
        if (this.state.cardInputMount) {
            editForm = (
              <div className="card">
                <div className="card-body card-content-small">
                  {Object.keys(data.Obj.fields).map((el, i) => {
                let subtitle = true;
                let type = 'text';
                const dateHeader = '';
                  if (i === 0) {
                      subtitle = false;
                  }
                  if (el === 'date1' || el === 'date2') {
                    type = 'date';
                  }
                      return (<div key={`${el}`}>{dateHeader}<CardTitle
                        className="card-title"
                        key={el}
                        type={type}
                        subtitle={subtitle}
                        name={el}
                        value={this.state[el]}
                        onChange={this.handleChangeForm}
                      /></div>);
              })}
                </div>
                <div className="card-body">
                  <a href="#" className="card-link text-success" onClick={this.saveObject}><span className="oi oi-check" />Save Changes</a>
                </div>
              </div>);
        }
        return (
          <div >{editForm}</div>
        );
    }
}

export default CardEdit;