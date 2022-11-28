document.addEventListener("DOMContentLoaded", () => {
  const doc = document;
  const btn = "button.bbs";
  const bbsUpdate = doc.querySelector(`${btn}.update`);
  const bbsDelete = doc.querySelector(`${btn}.delete`);
  const bbsList = doc.querySelector(`${btn}.list`);

  // 댓글 추가 버튼
  const bbsCommentAdd = doc.querySelector("button.comment");
  // 댓글 input box
  const bbsCommentInput = doc.querySelector("input.comment");
  const bbsCommentDelete = doc.querySelector("span.comment.delete");
  // 댓글 List 의 span tag 를 클릭했을 때
  // 발생하는 event 를 처리하기 위한 selector
  const bbsCommentBox = doc.querySelector(".comments.box");

  const commentListView = (commList) => {
    // listbox clear
    bbsCommentBox.textContent = "";
    const commentList = commList.map((comm) => {
      // .comment.list.box
      const pBox = document.createElement("P");
      pBox.className = "comment list box";
      let span = document.createElement("SPAN");
      span.className = "comment writer";
      span.textContent = `${comm.ct_writer || "익명"}`;
      pBox.appendChild(span);

      span = document.createElement("SPAN");
      span.className = "comment content";
      span.textContent = `${comm.ct_comment}`;
      pBox.appendChild(span);

      span = document.createElement("SPAN");
      span.className = "comment delete";
      // tag 는 innerHTML 로 삽입
      span.innerHTML = `&times;`;
      span.dataset.id = comm._id;
      pBox.appendChild(span);

      return pBox;
    }); // end map
    bbsCommentBox.append(...commentList);
  };

  bbsCommentBox?.addEventListener("click", (e) => {
    const span = e.target;
    if (span.tagName === "SPAN" && span.className.indexOf("delete") > 0) {
      if (confirm("댓글을 삭제합니다.")) {
        const commentId = span.dataset.id;
        // alert(commentId);
        // 서버에 DELETE RequestMethod 를 사용하여 데이터 삭제 요청
        fetch(`/comment/${id}/${commentId}`, { method: "DELETE" })
          .then((res) => res.json())
          .then((json) => {
            commentListView(json.b_comments);
          });
      }
    }
  });
  bbsCommentAdd?.addEventListener("click", () => {
    const comment = bbsCommentInput?.value;
    if (!comment) {
      doc.querySelector(".comments.input .msg").textContent =
        "댓글을 입력하세요.";
      bbsCommentInput.select();
      return false;
    } else {
      // id: detail.pug 에서 선언된 게시판 ID
      // comment: 입력한 댓글
      const commentData = { id, ct_comment: comment };
      /**
       * fetch 기본 method 는 GET 방식이다.
       * 데이터를 보낼 때는 POST, PUT 으로 전송을 해야 한다.
       * POST : 없는 데이터를 새로 추가할 때(INSERT 를 실행)
       * PUT: 기존 데이터를 변경하고자 할 때
       */
      const fetchOption = {
        method: "PUT", // RequestMethod
        body: JSON.stringify(commentData), // 서버로 보낼 데이터
        headers: { "Content-Type": "application/json" }, // 보낼 데이터 형식(json)
      };
      fetch("/comment/add", fetchOption)
        // fetch 가 성공적으로 수행되고 server 에서 req 가 오면
        // then() 함수가 호출된다.
        // res 변수에는 서버에서 보낸 Response 정보가 담겨있다.
        // Response 정보 중에서 우리가 필요한 것은
        // json type 의 데이터 뿐이다.
        // res 에서 json 을 추출하여  res.json()
        // 다음 then 함수에게 전달한다.  .then((res)=>{return res.json()})
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          // 위에서 선언한 commentListView 함수를 통하여
          // 댓글 리스트 화면에 보여주기
          commentListView(json.b_comments);
          // bbsCommentInput.value="";
          bbsCommentInput.value = "";
        });
    }
  });

  const modalbox = doc.querySelector(".modalbox");
  const modalCancel = doc.querySelector("button.modal.cancel");
  const modalDelete = doc.querySelector("button.modal.delete");
  const blur = doc.querySelector(".blur");

  const modal = {
    open() {
      modalbox.classList.add("open");
      blur.classList.add("active");
    },
    close() {
      modalbox.classList.remove("open");
      blur.classList.remove("active");
    },
  };
  modalCancel?.addEventListener("click", () => {
    modal.close();
  });
  modalDelete?.addEventListener("click", () => {
    document.location.href = `/delete/${id}`;
  });

  const clickEvent = (e) => {
    const btnInfo = e.target;
    const btnName = btnInfo.textContent;
    let URL = "/";
    switch (btnName) {
      case "수정":
        URL = `/update/${id}`;
        break;
      case "삭제":
        modal.open();
        return false;
        break;
      case "리스트로":
        URL = "/";
        break;
    } // end switch
    document.location.href = URL;
  }; // end clickEvent

  bbsUpdate.addEventListener("click", clickEvent);
  bbsDelete.addEventListener("click", clickEvent);
  bbsList.addEventListener("click", clickEvent);
});
