
document.addEventListener("DOMContentLoaded", () => {
  const book = document.querySelector(".diary-book");

  if (!book) return;

  const pageFlip = new St.PageFlip(book, {
    width: 500,
    height: 650,
    size: "stretch",
    minWidth: 300,
    maxWidth: 1000,
    minHeight: 400,
    maxHeight: 1200,
    maxShadowOpacity: 0.3,
    showCover: true,
    mobileScrollSupport: false,
    flippingTime: 800
  });

  pageFlip.loadFromHTML(
    document.querySelectorAll(".diary-page")
  );

  const next = document.getElementById("diary-next");
  const prev = document.getElementById("diary-prev");
  const status = document.getElementById("diary-status");

  function updateStatus() {
    if (status) {
      status.textContent =
        `Trang ${pageFlip.getCurrentPageIndex() + 1}`;
    }
  }

  next?.addEventListener("click", () => {
    pageFlip.flipNext();
  });

  prev?.addEventListener("click", () => {
    pageFlip.flipPrev();
  });

  pageFlip.on("flip", updateStatus);
  updateStatus();
});
