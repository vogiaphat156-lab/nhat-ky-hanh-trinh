
document.addEventListener("DOMContentLoaded", () => {
  const book = document.querySelector(".diary-book");
  const nextButton = document.getElementById("diary-next");
  const prevButton = document.getElementById("diary-prev");
  const status = document.getElementById("diary-status");

  if (!book) return;

  if (!window.St || !window.St.PageFlip) {
    if (status) {
      status.textContent = "Không tải được sách";
    }
    console.error("PageFlip library chưa được tải.");
    return;
  }

  const pages = book.querySelectorAll(".diary-page");

  const pageFlip = new St.PageFlip(book, {
    width: 500,
    height: 650,
    size: "stretch",
    minWidth: 280,
    maxWidth: 1000,
    minHeight: 360,
    maxHeight: 1300,
    maxShadowOpacity: 0.35,
    showCover: true,
    usePortrait: true,
    mobileScrollSupport: true,
    flippingTime: 900,
    drawShadow: true,
    autoSize: true,
    startPage: 0
  });

  pageFlip.loadFromHTML(pages);

  function updateStatus() {
    const current = pageFlip.getCurrentPageIndex();
    const total = pages.length;

    if (status) {
      status.textContent = `Trang ${current + 1} / ${total}`;
    }

    if (prevButton) {
      prevButton.disabled = current <= 0;
    }

    if (nextButton) {
      nextButton.disabled = current >= total - 1;
    }
  }

  nextButton?.addEventListener("click", () => {
    pageFlip.flipNext();
  });

  prevButton?.addEventListener("click", () => {
    pageFlip.flipPrev();
  });

  pageFlip.on("flip", updateStatus);

  pageFlip.on("changeState", updateStatus);

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      pageFlip.flipNext();
    }

    if (event.key === "ArrowLeft") {
      pageFlip.flipPrev();
    }
  });

  updateStatus();
});
