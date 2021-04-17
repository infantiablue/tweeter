"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CommentsComponent extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      comments: null,
      commentsCount: 0,
      error: null,
      postId: this.props.post_id,
      showComments: false,
      wordCount: 0,
      textContent: ""
    });

    _defineProperty(this, "toggleComments", () => {
      postData("/comments", {
        post_id: this.state.postId
      }).then(data => {
        if (!data.error) this.setState({
          showComments: !this.state.showComments
        });else notify(data.error, "danger");
      }).catch(error => this.setState({
        error
      }));
    });

    _defineProperty(this, "handleChange", event => {
      this.setState({
        wordCount: countWords(event.target.value)
      });
      this.setState({
        textContent: event.target.value
      });
    });

    _defineProperty(this, "postComment", () => {
      postData("/comments", {
        post_id: this.state.postId,
        text: this.state.textContent
      }, "PUT").then(data => {
        if (!data.error) {
          notify(data.message);
          this.setState({
            commentsCount: parseInt(this.state.commentsCount) + 1
          });
          this.toggleComments();
        } else notify(data.error, "danger");
      });
    });
  }

  componentDidMount() {
    postData("/comments", {
      post_id: this.state.postId
    }).then(data => {
      this.setState({
        comments: data.comments,
        commentsCount: data.count
      });
    }).catch(error => this.setState({
      error
    }));
  }

  render() {
    const {
      commentsCount,
      error
    } = this.state;
    if (error) return /*#__PURE__*/React.createElement("p", {
      className: "text-danger"
    }, error.message);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "mr-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "display-comment-btn mr-2",
      onClick: this.toggleComments
    }, /*#__PURE__*/React.createElement("i", {
      className: "bi bi-reply"
    })), commentsCount), this.state.showComments ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", {
      cols: "40",
      rows: "3",
      className: "form-control",
      id: "id_text",
      onChange: this.handleChange
    }), /*#__PURE__*/React.createElement("div", {
      id: "word-counter",
      className: "text-muted text-right"
    }, this.state.wordCount, " ", this.state.wordCount > 1 ? "words" : "word"), /*#__PURE__*/React.createElement("div", {
      className: "mt-2"
    }, /*#__PURE__*/React.createElement("a", {
      onClick: this.postComment,
      className: "text-primary edit-btn mr-2"
    }, "Post"), /*#__PURE__*/React.createElement("a", {
      onClick: this.toggleComments,
      className: "text-secondary edit-btn"
    }, "Cancel"))) : null);
  }

}

let commentsCtn = document.querySelectorAll(".comments-container");
commentsCtn.forEach(elm => {
  ReactDOM.render( /*#__PURE__*/React.createElement(CommentsComponent, {
    post_id: elm.dataset.postid
  }), elm);
});