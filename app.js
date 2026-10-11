/**
 * نور المجد لمواد البناء - الكويت
 * الوظائف التفاعلية: الفلترة والبحث السريع ونوافذ التفاصيل وإرسال الطلبات للواتساب
 * هاتف: 55225082
 */

document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const WHATSAPP_PHONE = '96555225082';

  // Elements
  const filterButtons = document.querySelectorAll('.cat-btn');
  const searchInput = document.getElementById('productSearchInput');
  const productCards = document.querySelectorAll('.product-card');
  const noResultsElem = document.getElementById('noResultsMsg');
  const mobileMenuBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('primaryNavLinks');

  // Modal Elements
  const modalBackdrop = document.getElementById('productDetailModal');
  const modalCloseBtn = document.getElementById('closeModalBtn');
  const modalImage = document.getElementById('modalImage');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalWaBtn = document.getElementById('modalWaBtn');
  const modalCallBtn = document.getElementById('modalCallBtn');

  // Contact Form
  const customOrderForm = document.getElementById('customOrderForm');

  // 1. Mobile Menu Toggle & Dismiss
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('show');
      mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        mobileMenuBtn.classList.remove('active');
      });
    });

    // Close menu when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('show');
        mobileMenuBtn.classList.remove('active');
      }
    });
  }

  // 1.1 Mobile Grid View Switcher (2 columns vs 1 column)
  const viewGrid2Btn = document.getElementById('viewGrid2Btn');
  const viewList1Btn = document.getElementById('viewList1Btn');
  const productsGrid = document.getElementById('productsGrid');

  if (viewGrid2Btn && viewList1Btn && productsGrid) {
    viewGrid2Btn.addEventListener('click', () => {
      viewGrid2Btn.classList.add('active');
      viewList1Btn.classList.remove('active');
      productsGrid.classList.remove('view-single-col');
    });

    viewList1Btn.addEventListener('click', () => {
      viewList1Btn.classList.add('active');
      viewGrid2Btn.classList.remove('active');
      productsGrid.classList.add('view-single-col');
    });
  }

  // 2. Filter & Live Search Handler
  let currentCategory = 'all';
  let currentSearchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardTitle = card.querySelector('.product-title')?.textContent?.toLowerCase() || '';
      const cardSpecs = card.querySelector('.product-specs')?.textContent?.toLowerCase() || '';
      
      const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
      const matchesSearch = !currentSearchQuery || 
        cardTitle.includes(currentSearchQuery) || 
        cardSpecs.includes(currentSearchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsElem) {
      noResultsElem.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Category filter click
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  // Live search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // 3. Quick View Modal Handlers
  function openProductModal(card) {
    if (!modalBackdrop) return;

    const title = card.getAttribute('data-title') || card.querySelector('.product-title')?.textContent || '';
    const category = card.getAttribute('data-category-name') || card.querySelector('.product-cat-tag')?.textContent || '';
    const desc = card.getAttribute('data-desc') || card.querySelector('.product-specs')?.textContent || '';
    const imgSrc = card.querySelector('.product-img-wrap img')?.getAttribute('src') || '';

    if (modalImage) modalImage.src = imgSrc;
    if (modalImage) modalImage.alt = title;
    if (modalCategory) modalCategory.textContent = category;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;

    // Configure WhatsApp Button
    if (modalWaBtn) {
      const textMessage = encodeURIComponent(`مرحباً نور المجد لمواد البناء، أرغب في الاستفسار وطلب: ${title}`);
      modalWaBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${textMessage}`;
    }

    if (modalCallBtn) {
      modalCallBtn.href = `tel:55225082`;
    }

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Attach card click events
  productCards.forEach(card => {
    const triggerButtons = card.querySelectorAll('.open-modal-trigger, .product-img-wrap, .btn-details');
    triggerButtons.forEach(el => {
      el.addEventListener('click', (e) => {
        // Prevent if user clicked on WhatsApp button
        if (e.target.closest('.btn-order-wa')) return;
        e.preventDefault();
        openProductModal(card);
      });
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) {
      closeModal();
    }
  });

  // 4. WhatsApp Quick Order for direct form
  if (customOrderForm) {
    customOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const customerName = document.getElementById('orderCustomerName')?.value.trim() || 'عميل';
      const orderMaterial = document.getElementById('orderMaterialSelect')?.value.trim() || 'مواد بناء متنوعة';
      const orderArea = document.getElementById('orderLocationArea')?.value.trim() || 'الكويت';
      const orderDetails = document.getElementById('orderDetailsText')?.value.trim() || '';

      let message = `مرحباً نور المجد لمواد البناء،\n`;
      message += `الاسم: ${customerName}\n`;
      message += `المادة المطلوبة: ${orderMaterial}\n`;
      message += `المنطقة: ${orderArea}\n`;
      if (orderDetails) {
        message += `تفاصيل إضافية: ${orderDetails}\n`;
      }
      message += `يرجى التواصل معي لتنسيق الطلبية.`;

      const encodedUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
      window.open(encodedUrl, '_blank');
    });
  }
});
