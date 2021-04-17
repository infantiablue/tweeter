"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class EditConmponent extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      post_id: this.props.post_id,
      textContent: this.props.textContent.trim(),
      showTextarea: false,
      wordCount: countWords(this.props.textContent)
    });

    _defineProperty(this, "handleChange", event => {
      this.setState({
        wordCount: countWords(event.target.value)
      });
      this.setState({
        textContent: event.target.value
      });
    });

    _defineProperty(this, "handleEdit", () => {
      postData("/edit", {
        post_id: this.state.post_id,
        text: this.state.textContent
      }).then(data => {
        if (!data.error) {
          notify(data.message);
          document.querySelector("#text-".concat(this.state.post_id)).innerHTML = this.state.textContent;
          this.toggleEdit();
        } else notify(data.error, "danger");
      });
    });

    _defineProperty(this, "handleDelete", () => {
      if (confirm("Are you sure to delete ?")) {
        postData("/delete", {
          post_id: this.state.post_id
        }).then(data => {
          if (!data.error) {
            let postElm = document.querySelector("#post-".concat(this.state.post_id));
            postElm.classList.add("animate__animated", "animate__fadeOut");
            postElm.addEventListener("animationend", () => postElm.remove());
          } else notify(data.error, "danger");
        });
      }
    });

    _defineProperty(this, "toggleEdit", () => {
      this.setState({
        showTextarea: !this.state.showTextarea
      }, () => {
        document.querySelector("#text-".concat(this.state.post_id)).style.display = !this.state.showTextarea ? "block" : "none";
      });
    });
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, !this.state.showTextarea ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
      onClick: this.toggleEdit,
      className: "text-info edit-btn mr-2"
    }, "Edit"), /*#__PURE__*/React.createElement("a", {
      onClick: this.handleDelete,
      className: "text-danger edit-btn"
    }, "Delete")) : null, this.state.showTextarea ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", {
      cols: "40",
      rows: "3",
      className: "form-control",
      id: "id_text",
      value: this.state.textContent,
      onChange: this.handleChange
    }), /*#__PURE__*/React.createElement("div", {
      id: "word-counter",
      className: "text-muted text-right"
    }, this.state.wordCount, " ", this.state.wordCount > 1 ? "words" : "word"), /*#__PURE__*/React.createElement("div", {
      className: "mt-2"
    }, /*#__PURE__*/React.createElement("a", {
      onClick: this.handleEdit,
      className: "text-primary edit-btn mr-2"
    }, "Save"), /*#__PURE__*/React.createElement("a", {
      onClick: this.toggleEdit,
      className: "text-secondary edit-btn"
    }, "Cancel"))) : null);
  }

}

let editCtn = document.querySelectorAll(".edit-container");
editCtn.forEach(elm => {
  let textContent = document.querySelector("#text-".concat(elm.dataset.postid)).textContent;
  ReactDOM.render( /*#__PURE__*/React.createElement(EditConmponent, {
    post_id: elm.dataset.postid,
    textContent: textContent
  }), elm);
});