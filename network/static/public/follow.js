"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FollowConmponent extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      is_followed: this.props.is_followed == "True" ? true : false,
      target_id: this.props.target_id,
      following: parseInt(this.props.following),
      followers: parseInt(this.props.followers)
    });

    _defineProperty(this, "handleFollow", () => {
      postData("/follow", {
        target_id: this.state.target_id
      }).then(data => {
        if (!data.error) {
          notify(data.message);
          if (data.followed) this.setState({
            followers: this.state.followers + 1
          });else this.setState({
            followers: this.state.followers - 1
          });
          this.setState({
            is_followed: !this.state.is_followed
          });
        } else {
          notify(data.error, "danger");
        }
      });
    });
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      onClick: this.handleFollow,
      className: "btn btn-info"
    }, this.state.is_followed ? "Unfollow" : "Follow"), /*#__PURE__*/React.createElement("span", {
      className: "ml-2"
    }, /*#__PURE__*/React.createElement("b", null, this.state.following), " Following"), /*#__PURE__*/React.createElement("span", {
      className: "ml-2"
    }, /*#__PURE__*/React.createElement("b", null, this.state.followers), " ", this.state.followers > 1 ? "Followers" : "Follower"));
  }

}

let followCtn = document.querySelector("#follow-container");
ReactDOM.render( /*#__PURE__*/React.createElement(FollowConmponent, {
  is_followed: followCtn.dataset.isfollowed,
  target_id: followCtn.dataset.target,
  followers: followCtn.dataset.followers,
  following: followCtn.dataset.following
}), followCtn);