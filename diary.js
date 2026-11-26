
document.addEventListener("DOMContentLoaded", function () {

  const book = document.getElementById("diary-book");

  if (!book || !window.St) {
    console.error("Không tìm thấy cuốn nhật ký hoặc thư viện PageFlip!");
    return;
  }

  // Khởi tạo hiệu ứng lật trang
  const pageFlip = new St.PageFlip(book, {
    width: 400,
    height: 560,
    size: "stretch",

    minWidth: 280,
    maxWidth: 400,
    minHeight: 390,
    maxHeight: 560,

    showCover: true,
    usePortrait: true,
    drawShadow: true,
    flippingTime: 1000,
    maxShadowOpacity: 0.4,
    mobileScrollSupport: true
  });

  // Đọc các trang nhật ký
  pageFlip.loadFromHTML(
    document.querySelectorAll(".diary-page")
  );

  // Nút trang tiếp
  document.getElementById("diary-next")
    .addEventListener("click", function () {
      pageFlip.flipNext();
    });

  // Nút trang trước
  document.getElementById("diary-prev")
    .addEventListener("click", function () {
      pageFlip.flipPrev();
    });

  // Hiển thị số trang
  pageFlip.on("flip", function (event) {
    document.getElementById("diary-status").textContent =
      "Trang " + (event.data + 1);
  });

});
