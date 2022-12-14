document.addEventListener("DOMContentLoaded", () => {
  const btnInput = document.querySelector("button.today.input");
  btnInput?.addEventListener("click", (tag) => {
    const updateTag = tag.currentTarget;
    // tag 에 update 라는 class 가 포함되어 있으면
    // 유효성 검사하지 말기
    // includes 는 array 에만 적용되므로 Array.from을 적용
    // if (Array.from(updateTag.classList).includes("update")) return false;

    const todayInputs = document.querySelectorAll("input");
    for (const tag of todayInputs) {
      // input tag 의 name seq 이면 건너뛰기
      if (tag.name !== "t_seq") {
        const value = tag.value;
        if (!value) {
          alert(`값을 입력해주세요\n"${tag.title}"`);
          tag.select(); // tag.focus() 를 포함한다
          return false;
        }
      }
    } // end for
    // 유효성 검사가 끝나면 server 로 데이터를 전송하기
    document.querySelector("form.today").submit();
  });
});
