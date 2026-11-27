
document.addEventListener("DOMContentLoaded", async () => {
  const book = document.querySelector(".diary-book");
  const pages = [...document.querySelectorAll(".diary-page")];

  const prevButton = document.getElementById("diary-prev");
  const nextButton = document.getElementById("diary-next");
  const status = document.getElementById("diary-status");

  if (!book || !pages.length) return;

  let pageFlip = null;

  // CHỜ FONT CHỮ TẢI XONG
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  // TÍNH CHIỀU CAO NỘI DUNG
  const root = document.documentElement;

  pages.forEach(page => {
    page.style.height = "auto";
    page.style.minHeight = "0";
  });

  const contentHeight = Math.max(
    ...pages.map(page => page.scrollHeight)
  );

  // Giữ chiều cao chung cho toàn bộ cuốn sổ
  // PageFlip cần các trang có cùng kích thước
  const pageHeight = Math.min(
    920,
    Math.max(760, contentHeight + 35)
  );

  root.style.setProperty(
    "--page-height",
    `${pageHeight}px`
  );

  book.style.height = `${pageHeight}px`;

  pages.forEach(page => {
    page.style.height = `${pageHeight}px`;
    page.style.minHeight = `${pageHeight}px`;
  });

  // KHỞI TẠO HIỆU ỨNG LẬT TRANG
  function initializeBook() {
    if (typeof St === "undefined" || !St.PageFlip) {
      console.error("Không tìm thấy thư viện PageFlip.");
      if (status) {
        status.textContent = "Không tải được hiệu ứng lật trang";
      }
      return;
    }

    pageFlip = new St.PageFlip(book, {
      width: 500,
      height: pageHeight,

      size: "stretch",

      minWidth: 280,
      maxWidth: 500,

      minHeight: Math.min(600, pageHeight),
      maxHeight: pageHeight,

      showCover: true,
      usePortrait: true,

      drawShadow: true,
      maxShadowOpacity: 0.3,

      flippingTime: 750,

      mobileScrollSupport: false,
      useMouseEvents: true,

      startPage: 0,
      autoSize: true
    });

    pageFlip.loadFromHTML(pages);

    pageFlip.on("flip", event => {
      updateStatus(event.data);
    });

    updateStatus(0);

    console.log("Nhật ký hành trình đã khởi động!");
  }

  // CẬP NHẬT SỐ TRANG
  function updateStatus(index) {
    if (!status) return;

    status.textContent =
      `Trang ${index + 1} / ${pages.length}`;

    if (prevButton) {
      prevButton.disabled = index <= 0;
    }

    if (nextButton) {
      nextButton.disabled =
        index >= pages.length - 1;
    }
  }

  initializeBook();

  // NÚT LẬT TRANG
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      if (pageFlip) pageFlip.flipPrev();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (pageFlip) pageFlip.flipNext();
    });
  }

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
    }, {
      capture: true,
      passive: true
    });

    book.addEventListener("mousedown", event => {
      if (event.target.closest(selector)) {
        event.stopImmediatePropagation();
      }
    }, true);
  });

  // CHO PHÉP CUỘN DANH SÁCH
  document.querySelectorAll(
    ".memory-gallery, .feeling-list, .diary-page"
  ).forEach(element => {
    element.style.overscrollBehavior = "contain";
  });

  // XEM TRƯỚC ẢNH KHI CHỌN
  const imageInput =
    document.getElementById("memory-image");

  if (imageInput) {
    const preview = document.createElement("img");

    preview.alt = "Ảnh xem trước";
    preview.style.display = "none";
    preview.style.width = "100%";
    preview.style.maxHeight = "150px";
    preview.style.objectFit = "contain";
    preview.style.marginTop = "8px";
    preview.style.border = "1px solid #d5c09c";
    preview.style.borderRadius = "4px";

    imageInput.insertAdjacentElement(
      "afterend",
      preview
    );

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
        alert("Vui lòng chọn một tệp hình ảnh.");
        imageInput.value = "";
        preview.style.display = "none";
        return;
      }

      currentPreviewURL = URL.createObjectURL(file);

      preview.src = currentPreviewURL;
      preview.style.display = "block";
    });

    const form = imageInput.closest("form");

    if (form) {
      form.addEventListener("reset", () => {
        preview.style.display = "none";

        if (currentPreviewURL) {
          URL.revokeObjectURL(currentPreviewURL);
          currentPreviewURL = null;
        }
      });
    }
  }
});
