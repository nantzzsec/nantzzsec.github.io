/**
 * Cyber Security Portfolio — Admin Panel JavaScript
 * Handles: sidebar toggle, delete confirmation, image preview, status toggle
 */

(function () {
  'use strict';

  // ============================================================
  // Sidebar Mobile Toggle
  // ============================================================
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar       = document.querySelector('.sidebar');
  const overlay       = document.getElementById('sidebar-overlay');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
  }

  // ============================================================
  // Delete Confirmation
  // ============================================================
  document.querySelectorAll('[data-confirm]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const message = el.dataset.confirm || 'Are you sure you want to delete this item?';
      if (!confirm(message)) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

  // ============================================================
  // Image Preview on File Input Change
  // ============================================================
  document.querySelectorAll('input[type="file"][data-preview]').forEach((input) => {
    input.addEventListener('change', () => {
      const previewId = input.dataset.preview;
      const preview   = document.getElementById(previewId);
      if (!preview) return;

      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (preview.tagName === 'IMG') {
            preview.src = e.target.result;
            preview.style.display = 'block';
          }
        };
        reader.readAsDataURL(input.files[0]);
      }
    });
  });

  // ============================================================
  // Auto-dismiss flash alerts
  // ============================================================
  document.querySelectorAll('.alert').forEach((alert) => {
    const closeBtn = alert.querySelector('.alert-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => dismissAlert(alert));
    }

    setTimeout(() => dismissAlert(alert), 6000);
  });

  function dismissAlert(alert) {
    alert.style.transition = 'opacity 0.4s ease, max-height 0.4s ease';
    alert.style.opacity    = '0';
    alert.style.maxHeight  = '0';
    alert.style.overflow   = 'hidden';
    alert.style.padding    = '0';
    alert.style.margin     = '0';
    setTimeout(() => alert.remove(), 400);
  }

  // ============================================================
  // Skill level input: live preview
  // ============================================================
  const levelInput   = document.getElementById('skill-level');
  const levelDisplay = document.getElementById('skill-level-display');
  const levelBar     = document.getElementById('skill-level-bar');

  if (levelInput) {
    function updateLevelDisplay() {
      const val = levelInput.value;
      if (levelDisplay) levelDisplay.textContent = val + '%';
      if (levelBar)     levelBar.style.width = val + '%';
    }
    levelInput.addEventListener('input', updateLevelDisplay);
    updateLevelDisplay();
  }

  // ============================================================
  // Status Toggle (AJAX-friendly inline toggle)
  // ============================================================
  document.querySelectorAll('.status-toggle-form').forEach((form) => {
    // Forms are submitted normally (no AJAX needed for simple PHP)
    // Just add a small visual indicator on submit
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      }
    });
  });

  // ============================================================
  // Table search/filter (client-side)
  // ============================================================
  const tableSearch = document.getElementById('table-search');
  if (tableSearch) {
    tableSearch.addEventListener('input', () => {
      const query = tableSearch.value.toLowerCase().trim();
      const rows  = document.querySelectorAll('tbody tr');

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  // ============================================================
  // Confirm before leaving page with unsaved changes
  // ============================================================
  const forms = document.querySelectorAll('form.track-changes');
  forms.forEach((form) => {
    let changed = false;

    form.querySelectorAll('input, textarea, select').forEach((input) => {
      input.addEventListener('change', () => { changed = true; });
      input.addEventListener('input', () => { changed = true; });
    });

    form.addEventListener('submit', () => { changed = false; });

    window.addEventListener('beforeunload', (e) => {
      if (changed) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  });

  // ============================================================
  // Message read indicator
  // ============================================================
  const unreadRows = document.querySelectorAll('tr.unread');
  unreadRows.forEach((row) => {
    row.querySelector('a')?.addEventListener('click', () => {
      row.classList.remove('unread');
    });
  });

  // ============================================================
  // PDF file name display on input change
  // ============================================================
  document.querySelectorAll('input[type="file"].show-filename').forEach((input) => {
    const display = document.getElementById(input.dataset.filenameDisplay);
    if (!display) return;
    input.addEventListener('change', () => {
      if (input.files && input.files[0]) {
        display.textContent = input.files[0].name;
      } else {
        display.textContent = 'No file selected';
      }
    });
  });

})();
