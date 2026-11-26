
document.addEventListener("DOMContentLoaded", () => {
  const book = document.querySelector(".diary-book");
  const nextButton = document.getElementById("diary-next");
  const prevButton = document.getElementById("diary-prev");
  const status = document.getElementById("diary-status");

  if (!book || !window.St || !window.St.PageFlip) {
    console.error("Không tải được PageFlip.");
    if (status) status.textContent = "Lỗi tải nhật ký";
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
    showCover: true,
    usePortrait: true,
    drawShadow: true,
    maxShadowOpacity: 0.3,
    flippingTime: 700,
    mobileScrollSupport: false,
    useMouseEvents: true,
    autoSize: true,
    startPage: 0
  });

  pageFlip.loadFromHTML(pages);

  function updateStatus() {
    const current = pageFlip.getCurrentPageIndex();

    status.textContent =
      `Trang ${current + 1} / ${pages.length}`;

    prevButton.disabled = current <= 0;
    nextButton.disabled = current >= pages.length - 1;
  }

  nextButton.addEventListener("click", () => {
    pageFlip.flipNext();
  });

  prevButton.addEventListener("click", () => {
    pageFlip.flipPrev();
  });

  pageFlip.on("flip", updateStatus);

  document.addEventListener("keydown", event => {
    if (
      event.target.matches("input, textarea, select") ||
      event.target.isContentEditable
    ) return;

    if (event.key === "ArrowRight") pageFlip.flipNext();
    if (event.key === "ArrowLeft") pageFlip.flipPrev();
  });

  updateStatus();
});
