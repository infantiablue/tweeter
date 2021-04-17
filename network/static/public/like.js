"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LikeConmponent extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      post_id: this.props.post_id,
      counter: parseInt(this.props.counter),
      is_liked: this.props.is_liked == "True" ? true : false
    });

    _defineProperty(this, "handleLike", () => {
      postData("/like", {
        post_id: this.state.post_id
      }).then(data => {
        if (!data.error) {
          notify(data.message);
          if (data.liked) this.setState({
            counter: this.state.counter + 1
          });else this.setState({
            counter: this.state.counter - 1
          });
          this.setState({
            is_liked: !this.state.is_liked
          });
        } else notify(data.error, "danger");
      });
    });
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      onClick: this.handleLike,
      className: "like-btn bi ".concat(this.state.is_liked ? "bi-heart-fill" : "bi-heart")
    }), /*#__PURE__*/React.createElement("span", {
      className: "ml-2"
    }, this.state.counter, " ", this.state.counter > 1 ? "Likes" : "Like"));
  }

}

let likeCtn = document.querySelectorAll(".like-container");
likeCtn.forEach(elm => {
  ReactDOM.render( /*#__PURE__*/React.createElement(LikeConmponent, {
    post_id: elm.dataset.postid,
    counter: elm.dataset.counter,
    is_liked: elm.dataset.isliked
  }), elm);
});