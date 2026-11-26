
document.addEventListener("DOMContentLoaded", () => {
  const book = document.querySelector(".diary-book");
  const pages = document.querySelectorAll(".diary-page");

  const prevButton = document.getElementById("diary-prev");
  const nextButton = document.getElementById("diary-next");
  const status = document.getElementById("diary-status");

  if (!book || !pages.length) return;

  let pageFlip = null;

  // KHỞI TẠO HIỆU ỨNG LẬT TRANG
  if (typeof St !== "undefined" && St.PageFlip) {
    pageFlip = new St.PageFlip(book, {
      width: 500,
      height: 650,
      size: "stretch",
      minWidth: 280,
      maxWidth: 500,
      minHeight: 380,
      maxHeight: 650,
      showCover: true,
      usePortrait: true,
      drawShadow: true,
      maxShadowOpacity: 0.25,
      flippingTime: 700,
      mobileScrollSupport: false,
      useMouseEvents: true,
      startPage: 0,
      autoSize: true
    });

    pageFlip.loadFromHTML(pages);

    pageFlip.on("flip", (event) => {
      updateStatus(event.data);
    });

    updateStatus(0);
  } else {
    console.error("Không tìm thấy thư viện PageFlip.");
    status.textContent = "Lỗi hiệu ứng lật trang";
  }

  // CẬP NHẬT SỐ TRANG
  function updateStatus(index) {
    status.textContent = `Trang ${index + 1} / ${pages.length}`;
    prevButton.disabled = index <= 0;
    nextButton.disabled = index >= pages.length - 1;
  }

  // NÚT ĐIỀU KHIỂN
  prevButton.addEventListener("click", () => {
    if (pageFlip) pageFlip.flipPrev();
  });

  nextButton.addEventListener("click", () => {
    if (pageFlip) pageFlip.flipNext();
  });

  // KHÔNG LẬT TRANG KHI ĐANG NHẬP LIỆU
  const interactiveAreas = [
    ".community-form",
    ".memory-gallery",
    ".feeling-list"
  ];

  interactiveAreas.forEach(selector => {
    book.addEventListener("pointerdown", event => {
      if (event.target.closest(selector)) {
        event.stopImmediatePropagation();
      }
    }, true);

    book.addEventListener("touchstart", event => {
      if (event.target.closest(selector)) {
        event.stopImmediatePropagation();
      }
    }, { capture: true, passive: true });

    book.addEventListener("mousedown", event => {
      if (event.target.closest(selector)) {
        event.stopImmediatePropagation();
      }
    }, true);
  });

  // CHO PHÉP CUỘN DANH SÁCH ẢNH VÀ THƯ
  document.querySelectorAll(
    ".memory-gallery, .feeling-list"
  ).forEach(element => {
    element.style.touchAction = "pan-y";
    element.style.overscrollBehavior = "contain";
  });

  // XEM TRƯỚC ẢNH KHI CHỌN
  const imageInput = document.getElementById("memory-image");

  if (imageInput) {
    const preview = document.createElement("img");

    preview.style.display = "none";
    preview.style.width = "100%";
    preview.style.maxHeight = "150px";
    preview.style.objectFit = "contain";
    preview.style.marginTop = "6px";
    preview.style.border = "1px solid #d5c09c";
    preview.style.borderRadius = "4px";

    imageInput.insertAdjacentElement("afterend", preview);

    let currentPreviewURL = null;

    imageInput.addEventListener("change", () => {
      const file = imageInput.files[0];

      if (currentPreviewURL) {
        URL.revokeObjectURL(currentPreviewURL);
        currentPreviewURL = null;
      }

      if (!file) {
        preview.removeAttribute("src");
        preview.style.display = "none";
        return;
      }

      if (!file.type.startsWith("image/")) {
        preview.style.display = "none";
        alert("Vui lòng chọn một tệp hình ảnh.");
        imageInput.value = "";
        return;
      }

      currentPreviewURL = URL.createObjectURL(file);
      preview.src = currentPreviewURL;
      preview.style.display = "block";
    });

    imageInput.closest("form").addEventListener("reset", () => {
      preview.style.display = "none";

      if (currentPreviewURL) {
        URL.revokeObjectURL(currentPreviewURL);
        currentPreviewURL = null;
      }
    });
  }

  console.log("Nhật ký hành trình đã khởi động!");
});

