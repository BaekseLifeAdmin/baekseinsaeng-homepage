/* ============================================================
   counseling.js — 폼 검증, 전화번호 포맷, 개인정보 토글
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPhoneFormat();
  initPrivacyToggle();
  initFormSubmit();
});

const CONSULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwN5vx3CLEGZiAfXbTj5hUOG2o-LxqscaYg-5XE5giPd620hdLwA-G0WJ7k9QnkS6QtXA/exec';
const CONSULT_SECRET_KEY = 'BAEKSE_CONSULT_2026_RANDOM_KEY';

/* ── 전화번호 자동 하이픈 ─────────────────────────────────── */
function initPhoneFormat() {
  const phoneInput = document.getElementById('phone');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', () => {
    let raw = phoneInput.value.replace(/\D/g, '');
    if (raw.length > 11) raw = raw.slice(0, 11);

    let formatted = '';
    if (raw.startsWith('02')) {
      if (raw.length <= 2) formatted = raw;
      else if (raw.length <= 5) formatted = raw.slice(0, 2) + '-' + raw.slice(2);
      else if (raw.length <= 9) formatted = raw.slice(0, 2) + '-' + raw.slice(2, 5) + '-' + raw.slice(5);
      else formatted = raw.slice(0, 2) + '-' + raw.slice(2, 6) + '-' + raw.slice(6);
    } else {
      if (raw.length <= 3) formatted = raw;
      else if (raw.length <= 6) formatted = raw.slice(0, 3) + '-' + raw.slice(3);
      else if (raw.length <= 10) formatted = raw.slice(0, 3) + '-' + raw.slice(3, 6) + '-' + raw.slice(6);
      else formatted = raw.slice(0, 3) + '-' + raw.slice(3, 7) + '-' + raw.slice(7);
    }
    phoneInput.value = formatted;
  });
}

/* ── 개인정보 내용 보기 토글 ──────────────────────────────── */
function initPrivacyToggle() {
  const btn = document.getElementById('privacyDetailBtn');
  const detail = document.getElementById('privacyDetail');
  if (!btn || !detail) return;

  btn.addEventListener('click', () => {
    const hidden = detail.hidden;
    detail.hidden = !hidden;
    btn.textContent = hidden ? '내용 닫기' : '내용 보기';
  });
}

/* ── 폼 유효성 검사 + 제출 ────────────────────────────────── */
function initFormSubmit() {
  const form = document.getElementById('consultForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm();
  });

  /* 실시간 오류 해제 */
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => clearFieldError(el));
    el.addEventListener('change', () => clearFieldError(el));
  });

  function getPayload() {
    const name = form.querySelector('#name');
    const phone = form.querySelector('#phone');
    const age = form.querySelector('#age');
    const consultType = form.querySelector('input[name="consultType"]:checked');
    const services = Array.from(form.querySelectorAll('input[name="services"]:checked')).map(input => input.value);
    const privacyAgree = form.querySelector('#privacyAgree');

    return {
      name: name ? name.value.trim() : '',
      phone: phone ? phone.value.trim() : '',
      age: age ? age.value.trim() : '',
      consultType: consultType ? consultType.value : '',
      services,
      privacyAgree: Boolean(privacyAgree && privacyAgree.checked),
      secretKey: CONSULT_SECRET_KEY
    };
  }

  function validate(payload) {
    let valid = true;

    const name = form.querySelector('#name');
    if (!name.value.trim()) {
      setError(name, 'name-error', '이름을 입력해 주세요.');
      valid = false;
    } else clearError(name, 'name-error');

    const phone = form.querySelector('#phone');
    const phoneRaw = phone.value.replace(/\D/g, '');
    if (!phone.value.trim()) {
      setError(phone, 'phone-error', '연락처를 입력해 주세요.');
      valid = false;
    } else if (!/^010\d{8}$/.test(phoneRaw)) {
      setError(phone, 'phone-error', '010으로 시작하는 11자리 휴대폰 번호를 입력해 주세요.');
      valid = false;
    } else clearError(phone, 'phone-error');

    if (!payload.consultType) {
      const methodError = document.getElementById('method-error');
      if (methodError) methodError.textContent = '상담 방법을 선택해 주세요.';
      valid = false;
    } else {
      const methodError = document.getElementById('method-error');
      if (methodError) methodError.textContent = '';
    }

    const privacy = form.querySelector('#privacyAgree');
    if (!privacy.checked) {
      document.getElementById('privacy-error').textContent = '개인정보 수집·이용에 동의해 주세요.';
      valid = false;
    } else {
      document.getElementById('privacy-error').textContent = '';
    }

    if (!valid) {
      alert('보호자 성함, 연락처, 상담 방법, 개인정보 동의를 확인해 주세요.');
    }

    return valid;
  }

  function setError(input, errorId, msg) {
    input.classList.add('error');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = msg;
  }

  function clearError(input, errorId) {
    input.classList.remove('error');
    const id = errorId || input.id + '-error';
    const errEl = document.getElementById(id);
    if (errEl) errEl.textContent = '';
  }

  function clearFieldError(input) {
    if (input.id === 'privacyAgree') {
      clearError(input, 'privacy-error');
      return;
    }
    if (input.name === 'consultType') {
      const methodError = document.getElementById('method-error');
      if (methodError) methodError.textContent = '';
      return;
    }
    clearError(input);
  }

  function submitForm() {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');
    const originalButtonHtml = submitBtn ? submitBtn.innerHTML : '';

    if (successMessage) successMessage.hidden = true;
    if (errorMessage) errorMessage.hidden = true;

    const formData = getPayload();
    if (!validate(formData)) return;

    const phoneInput = form.querySelector('#phone');
    const phoneRaw = formData.phone.replace(/\D/g, '');
    if (!/^010\d{8}$/.test(phoneRaw)) {
      if (phoneInput) {
        setError(phoneInput, 'phone-error', '010으로 시작하는 11자리 휴대폰 번호를 입력해 주세요.');
        phoneInput.focus();
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '전송 중...';
    }

    fetch(CONSULT_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(formData)
    })
      .then(() => {
        if (successMessage) successMessage.hidden = false;
        if (errorMessage) errorMessage.hidden = true;
        form.reset();
      })
      .catch((error) => {
        console.error(error);
        if (successMessage) successMessage.hidden = true;
        if (errorMessage) errorMessage.hidden = false;
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalButtonHtml;
        }
      });
  }
}
