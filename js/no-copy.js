// 콘텐츠 무단 복사 방지: 우클릭/복사/잘라내기 차단 (입력 요소는 예외)
(function () {
  "use strict";

  function isEditableTarget(target) {
    if (!target) return false;
    var tag = target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "OPTION") {
      return true;
    }
    return !!target.isContentEditable;
  }

  document.addEventListener("contextmenu", function (e) {
    if (isEditableTarget(e.target)) return;
    e.preventDefault();
  });

  document.addEventListener("copy", function (e) {
    if (isEditableTarget(e.target)) return;
    e.preventDefault();
  });

  document.addEventListener("cut", function (e) {
    if (isEditableTarget(e.target)) return;
    e.preventDefault();
  });
})();
