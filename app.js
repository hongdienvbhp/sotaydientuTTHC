const state = { items: [], filtered: [], page: 1, perPage: 10 };
const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const normalize = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();

function uniqueValues(field) {
  return [...new Set(state.items.map((item) => item[field]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "vi"));
}

function populateSelect(id, values) {
  const select = $(id);
  values.forEach((value) => select.insertAdjacentHTML("beforeend", `<option value="${esc(value)}">${esc(value)}</option>`));
}

function bindEvents() {
  ["#search", "#groupFilter", "#fieldFilter", "#levelFilter"].forEach((id) => {
    $(id).addEventListener(id === "#search" ? "input" : "change", () => {
      state.page = 1;
      filterAndRender();
    });
  });
  $("#clearSearch").addEventListener("click", () => { $("#search").value = ""; $("#search").focus(); state.page = 1; filterAndRender(); });
  $("#resetFilters").addEventListener("click", resetFilters);
  $("#emptyReset").addEventListener("click", resetFilters);
  $("#prevPage").addEventListener("click", () => changePage(-1));
  $("#nextPage").addEventListener("click", () => changePage(1));
  $("#procedureList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-detail-id]");
    if (button) openDetail(Number(button.dataset.detailId));
  });
  $("#closeDialog").addEventListener("click", closeDetail);
  $("#detailDialog").addEventListener("click", (event) => { if (event.target === $("#detailDialog")) closeDetail(); });
  $("#increaseFont").addEventListener("click", () => changeFont(1));
  $("#decreaseFont").addEventListener("click", () => changeFont(-1));
  $("#contrastToggle").addEventListener("click", toggleContrast);
  $("#backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("popstate", syncDetailFromUrl);
}

function resetFilters() {
  $("#search").value = "";
  $("#groupFilter").value = "";
  $("#fieldFilter").value = "";
  $("#levelFilter").value = "";
  state.page = 1;
  filterAndRender();
}

function filterAndRender() {
  const query = normalize($("#search").value);
  const group = $("#groupFilter").value;
  const field = $("#fieldFilter").value;
  const level = $("#levelFilter").value;
  $("#clearSearch").hidden = !query;
  state.filtered = state.items.filter((item) => {
    const haystack = normalize([item.name, item.code, item.field, item.group, item.level, item.search].join(" "));
    return (!query || query.split(/\s+/).every((term) => haystack.includes(term))) && (!group || item.group === group) && (!field || item.field === field) && (!level || item.level === level);
  });
  renderList();
}

function renderList() {
  const pages = Math.max(1, Math.ceil(state.filtered.length / state.perPage));
  state.page = Math.min(state.page, pages);
  const start = (state.page - 1) * state.perPage;
  const visible = state.filtered.slice(start, start + state.perPage);
  $("#resultCount").textContent = `${state.filtered.length} thủ tục phù hợp`;
  $("#procedureList").innerHTML = visible.map((item) => `
    <article class="procedure-card">
      <div class="procedure-number" aria-hidden="true">${String(item.id).padStart(2, "0")}</div>
      <div class="procedure-content">
        <div class="procedure-meta"><span>${esc(item.code)}</span><span>${esc(item.field)}</span><span>${esc(item.level)}</span></div>
        <h3>${esc(item.name)}</h3>
        <p>${item.pdfAvailable ? "Có tài liệu PDF hướng dẫn chi tiết." : "Chưa có tài liệu PDF trong Sổ tay; có thể tra cứu trên Cổng Dịch vụ công."}</p>
        <div class="procedure-actions">
          <button class="button button-primary" type="button" data-detail-id="${item.id}">Xem hướng dẫn</button>
          ${item.online ? `<a class="external-link" href="${esc(item.online)}" target="_blank" rel="noopener noreferrer">Mở Cổng Dịch vụ công <span aria-hidden="true">↗</span><span class="sr-only"> (mở trang bên ngoài)</span></a>` : ""}
        </div>
      </div>
    </article>`).join("");
  $("#emptyState").hidden = state.filtered.length !== 0;
  $("#pagination").hidden = state.filtered.length <= state.perPage;
  $("#pageInfo").textContent = `Trang ${state.page} / ${pages}`;
  $("#prevPage").disabled = state.page <= 1;
  $("#nextPage").disabled = state.page >= pages;
}

function changePage(delta) {
  state.page += delta;
  renderList();
  $("#catalogue").scrollIntoView({ behavior: "smooth", block: "start" });
}

function section(title, text) {
  if (!text) return "";
  const lines = String(text).split("\n").map((line) => line.trim()).filter(Boolean);
  return `<section class="detail-section"><h3>${esc(title)}</h3><div class="source-text">${lines.map((line) => `<p>${esc(line)}</p>`).join("")}</div></section>`;
}

function openDetail(id, updateHistory = true) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;
  const detail = item.detail || {};
  $("#detailCode").textContent = `${item.code} · ${item.field} · ${item.level}`;
  $("#detailTitle").textContent = item.name;
  $("#detailBody").innerHTML = `
    <div class="detail-warning" role="note"><strong>Lưu ý:</strong> Nội dung dưới đây dùng để chuẩn bị và tham khảo. Trước khi nộp, người dùng cần kiểm tra thông tin đang công bố trên Cổng Dịch vụ công.</div>
    <div class="detail-actions">
      ${item.pdfAvailable ? `<a class="button button-secondary" href="${encodeURI(item.pdf)}" target="_blank">Xem PDF hướng dẫn</a>` : ""}
      ${item.online ? `<a class="button button-primary" href="${esc(item.online)}" target="_blank" rel="noopener noreferrer">Nộp hồ sơ trên Cổng DVC <span aria-hidden="true">↗</span></a>` : ""}
      <button class="button button-print" type="button" onclick="window.print()">In hướng dẫn</button>
    </div>
    ${section("Trình tự thực hiện", detail.sequence)}
    ${section("Thành phần hồ sơ", detail.documents)}
    ${section("Cách thức thực hiện, thời hạn và phí", detail.methods)}
    ${section("Căn cứ pháp lý ghi trong tài liệu nguồn", detail.legal)}
    <section class="detail-section source-note"><h3>Nguồn và phạm vi sử dụng</h3><p>Nội dung được tổng hợp từ tài liệu PDF hiện có trong Sổ tay và liên kết đến Cổng Dịch vụ công Quốc gia. Sổ tay không tiếp nhận hồ sơ và không thay thế công bố của cơ quan có thẩm quyền.</p></section>`;
  $("#detailDialog").showModal();
  document.body.classList.add("dialog-open");
  if (updateHistory) {
    const url = new URL(window.location.href);
    url.searchParams.set("tthc", item.code);
    history.pushState({ id }, "", url);
  }
}

function closeDetail(updateHistory = true) {
  if ($("#detailDialog").open) $("#detailDialog").close();
  document.body.classList.remove("dialog-open");
  if (updateHistory) {
    const url = new URL(window.location.href);
    url.searchParams.delete("tthc");
    history.pushState({}, "", url);
  }
}

function syncDetailFromUrl() {
  const code = new URL(window.location.href).searchParams.get("tthc");
  const item = state.items.find((entry) => entry.code === code);
  if (item) openDetail(item.id, false); else closeDetail(false);
}

function changeFont(direction) {
  const root = document.documentElement;
  const current = Number(root.dataset.fontScale || 100);
  const next = Math.min(125, Math.max(90, current + direction * 10));
  root.dataset.fontScale = next;
  root.style.fontSize = `${next}%`;
}

function toggleContrast() {
  const active = document.body.classList.toggle("high-contrast");
  $("#contrastToggle").setAttribute("aria-pressed", String(active));
}

async function init() {
  try {
    const [dataResponse, manifestResponse] = await Promise.all([
      fetch("data/procedures.json"),
      fetch("data/pdf-manifest.json")
    ]);
    if (!dataResponse.ok || !manifestResponse.ok) throw new Error("Không tải được dữ liệu Sổ tay");
    const availablePdfs = new Set(await manifestResponse.json());
    state.items = (await dataResponse.json()).map((item) => ({
      ...item,
      pdfAvailable: Boolean(item.pdf && availablePdfs.has(item.pdf))
    }));
    populateSelect("#groupFilter", uniqueValues("group"));
    populateSelect("#fieldFilter", uniqueValues("field"));
    populateSelect("#levelFilter", uniqueValues("level"));
    bindEvents();
    filterAndRender();
    syncDetailFromUrl();
  } catch (error) {
    $("#procedureList").innerHTML = `<div class="error-state"><strong>Không tải được dữ liệu thủ tục.</strong><p>Vui lòng tải lại trang hoặc liên hệ Trung tâm để được hỗ trợ.</p></div>`;
    console.error(error);
  }
}

init();
