/* =========================================
   สร้างกล่องสินค้า
========================================= */

function createProductBox() {
    const product = document.createElement("div");
    product.className = "product-area";

    product.innerHTML = `
        <button class="delete-btn" onclick="deleteProduct(this)">×</button>

        <input type="text" class="product-name-input"
               value="ชื่อสินค้า" onclick="this.select()">

        <div class="field">
            <label>ราคาสินค้า<span style="color:#888;">(ต่อหน่วย)</span></label>
            <div class="input-wrap">
                <input type="number" class="price" min="0" step="any">
                <span class="input-unit">บาท</span>
            </div>
        </div>

        <div class="field">
            <label>จำนวน <span style="color:#888;">(ที่ต้องการ)</span></label>
            <div class="input-wrap">
                <input type="number" class="quantity" min="0" step="any">
                <span class="input-unit">หน่วย</span>
            </div>
        </div>

        <div class="field">
            <label>โปรโมชั่น</label>
            <div class="input-wrap">
                <select class="promotion-select">
                    <option value="0">ไม่มีโปรโมชั่น</option>
                    <option value="1">1.ลด a บาทต่อหน่วย</option>
                    <option value="2">2.ลด a%</option>
                    <option value="3">3.ซื้อ a หน่วย ราคา b บาท</option>
                    <option value="4">4.ซื้อ a หน่วย ลด b บาท</option>
                    <option value="5">5.ซื้อ a หน่วยขึ้นไป ลด b บาท</option>
                    <option value="6">6.ซื้อ a หน่วย ลด b%</option>
                    <option value="7">7.ซื้อ a หน่วยขึ้นไป ลด b%</option>
                    <option value="8">8.ซื้อ a หน่วย เหลือหน่วยละ b บาท</option>
                    <option value="9">9.ซื้อ a หน่วยขึ้นไป เหลือหน่วยละ b บาท</option>
                    <option value="10">10.ซื้อ a แถม b</option>
                    <option value="11">11.ซื้อครบ a บาท ลด b บาท</option>
                    <option value="12">12.ซื้อครบ a บาท ลด b%</option>
                    <option value="13">13.ราคาสมาชิก a บาท</option>
                </select>
            </div>

            <div class="promo-values">
                <input type="number" class="promo-x"
                       placeholder="ค่า a" min="0" step="any">
                <input type="number" class="promo-y"
                       placeholder="ค่า b" min="0" step="any">
            </div>
        </div>
    `;

        // เลือกช่อง X และ Y ตามโปรโมชั่น
    const promotionSelect = product.querySelector(".promotion-select");
    const xInput = product.querySelector(".promo-x");
    const yInput = product.querySelector(".promo-y");

    function updatePromoFields() {
        const type = Number(promotionSelect.value);

        // โปรโมชั่นที่ไม่ต้องใช้ค่า X หรือ Y
        if (type === 0) {
            xInput.style.display = "none";
            yInput.style.display = "none";
        }

        // โปรโมชั่นที่ใช้เฉพาะ X
        else if (type === 1 || type === 2 || type === 13) {
            xInput.style.display = "";
            yInput.style.display = "none";
            yInput.value = "";
        }

        // โปรโมชั่นที่ใช้ทั้ง X และ Y
        else {
            xInput.style.display = "";
            yInput.style.display = "";
        }
    }

    // เมื่อเปลี่ยนโปรโมชั่น ให้ปรับช่องกรอกทันที
    promotionSelect.addEventListener("change", updatePromoFields);

    // ตั้งค่าเริ่มต้น
    updatePromoFields();

    return product;
}

/* =========================================
   สร้างกล่องสีขาว
========================================= */

function createGroup() {
    const group = document.createElement("div");
    group.className = "calculator-box";

    group.appendChild(createProductBox());

    const addButton = document.createElement("button");
    addButton.className = "add-product-btn";
    addButton.textContent = "+เพิ่มสินค้า";

    addButton.onclick = function () {
        group.insertBefore(createProductBox(), addButton);
    };

    group.appendChild(addButton);

    const calculateButton = document.createElement("button");
    calculateButton.className = "calculate-btn";
    calculateButton.textContent = "ยืนยัน";

    calculateButton.onclick = function () {
        calculateGroup(group);
    };

    group.appendChild(calculateButton);

    const results = document.createElement("div");
    results.className = "results";
    group.appendChild(results);

    return group;
}


/* =========================================
   เพิ่มกล่องสีขาวใหม่
========================================= */

function addGroup() {
    const groups = document.getElementById("groups");
    groups.appendChild(createGroup());
}


/* =========================================
   ลบกล่องสินค้า
========================================= */

function deleteProduct(button) {
    const product = button.closest(".product-area");

    if (product) {
        product.remove();
    }
}

/* =========================================
   คำนวณราคาสุทธิตามโปรโมชั่น
========================================= */

function calculatePromotion(price, quantity, promoType, x, y) {
    price = Math.max(0, Number(price) || 0);
    quantity = Math.max(0, Number(quantity) || 0);
    x = Math.max(0, Number(x) || 0);
    y = Math.max(0, Number(y) || 0);

    const subtotal = price * quantity;
    const type = Number(promoType);
    const enoughUnits = x > 0 && quantity >= x;

    let total = subtotal;

    switch (type) {
        case 0:
            total = subtotal;
            break;

        case 1: // ลด X บาทต่อหน่วย
            total = (price - x) * quantity;
            break;

        case 2: // ลด X%
            total = subtotal * (1 - Math.min(x, 100) / 100);
            break;

        case 3: // ทุกชุด X หน่วย ราคา Y บาท
            if (x > 0) {
                const bundles = Math.floor(quantity / x);
                const remaining = quantity % x;
                total = bundles * y + remaining * price;
            }
            break;

        case 4: // ทุกชุด X หน่วย ลด Y บาท
            if (x > 0) {
                total = subtotal - Math.floor(quantity / x) * y;
            }
            break;

        case 5: // ซื้อถึง X หน่วย ลด Y บาทหนึ่งครั้ง
            if (enoughUnits) total = subtotal - y;
            break;

        case 6: // ทุกชุด X หน่วย ลด Y%
            if (x > 0) {
                const bundles = Math.floor(quantity / x);
                const discount =
                    bundles * x * price * (Math.min(y, 100) / 100);
                total = subtotal - discount;
            }
            break;

        case 7: // ซื้อถึง X หน่วย ลด Y%
            if (enoughUnits) {
                total = subtotal * (1 - Math.min(y, 100) / 100);
            }
            break;

        case 8: // ทุกชุด X หน่วย เหลือหน่วยละ Y บาท
            if (x > 0) {
                const bundles = Math.floor(quantity / x);
                const remaining = quantity % x;
                total = bundles * x * y + remaining * price;
            }
            break;

        case 9: // ซื้อถึง X หน่วย เหลือหน่วยละ Y บาท
            if (enoughUnits) total = quantity * y;
            break;

        case 10: // ซื้อ X แถม Y
    if (x > 0 && y > 0) {
        const setSize = x + y;
        const fullSets = Math.floor(quantity / setSize);
        const remaining = quantity % setSize;

        // ส่วนที่เหลือ: ถ้าซื้อถึง x แล้ว ที่เกิน x ถือเป็นของแถม (ไม่เกิน y)
        const freeFromRemaining = Math.min(Math.max(remaining - x, 0), y);

        const freeUnits = fullSets * y + freeFromRemaining;
        total = (quantity - freeUnits) * price;
    }
    break;

        case 11: // ซื้อครบ X บาท ลด Y บาท
            if (subtotal >= x) total = subtotal - y;
            break;

        case 12: // ซื้อครบ X บาท ลด Y%
            if (subtotal >= x) {
                total = subtotal * (1 - Math.min(y, 100) / 100);
            }
            break;

        case 13: // ราคาสมาชิก X บาทต่อหน่วย
            total = quantity * x;
            break;

        default:
            total = subtotal;
    }

    return Math.max(0, total);
}

/* =========================================
   คำนวณสินค้าภายในกล่องสีขาว
========================================= */

function calculateGroup(group) {
    const products = group.querySelectorAll(".product-area");
    const data = [];

    products.forEach(function (product, index) {
        const name =
            product.querySelector(".product-name-input").value.trim()
            || "ชื่อสินค้า";

        const priceInput = product.querySelector(".price").value;
        const quantityInput = product.querySelector(".quantity").value;

        // ข้ามสินค้าที่ยังไม่ได้กรอกราคาและจำนวน
        if (priceInput === "" || quantityInput === "") return;

        const price = Number(priceInput);
        const quantity = Number(quantityInput);
        const promotion = product.querySelector(".promotion-select").value;
        const x =  Number(product.querySelector(".promo-x").value) || 0;
        const y = Number(product.querySelector(".promo-y").value) || 0;

        if (
            !Number.isFinite(price) ||
            !Number.isFinite(quantity) ||
            price < 0 ||
            quantity < 0
        ) return;

        const total = calculatePromotion(
       price, quantity, promotion, x, y
      );

      // คำนวณจำนวนสินค้าที่ได้รับฟรี
      let freeUnits = 0;

      if (Number(promotion) === 10 && x > 0 && y > 0) {
          const setSize = x + y;
          const fullSets = Math.floor(quantity / setSize);
          const remaining = quantity % setSize;

          const freeFromRemaining = Math.min(
              Math.max(remaining - x, 0),
        y
    );

    freeUnits = fullSets * y + freeFromRemaining;
}
        data.push({
    index: index,
    name: name,
    total: total,
    promotion: Number(promotion),
    x: x,
    y: y,
    quantity: quantity,
    promotion: Number(promotion),
    freeUnits: freeUnits
      });
    });

    // เรียงสินค้าจากราคาถูกไปแพง
data.sort(function (a, b) {

    const priceA = Math.round(a.total * 100) / 100;
    const priceB = Math.round(b.total * 100) / 100;

    // เงื่อนไขที่ 1: ราคาสุทธิไม่เท่ากัน
    if (priceA !== priceB) {
        return priceA - priceB;
    }

    // เงื่อนไขที่ 2: เป็น Case 10 และค่า X เท่ากัน
    if (
        a.promotion === 10 &&
        b.promotion === 10 &&
        a.x === b.x &&
        a.y !== b.y
    ) {
        // ค่า Y มากกว่าให้อยู่ก่อน
        return b.y - a.y;
    }

    // เงื่อนไขอื่น ๆ คงลำดับเดิม
    return a.index - b.index;
});

    // กำหนดอันดับแบบ Dense Ranking
    let currentRank = 0;
    let previousPrice = null;

    data.forEach(function (product) {
        const roundedPrice = Math.round(product.total * 100) / 100;

        if (
            previousPrice === null ||
            roundedPrice !== previousPrice
        ) {
            currentRank++;
        }

        product.rank = currentRank;
        previousPrice = roundedPrice;
    });

    const results = group.querySelector(".results");
    results.innerHTML = "";

    if (data.length === 0) {
        results.innerHTML = `
            <div class="result-box">
                <div class="result-text">
                    กรุณากรอกราคาและจำนวน
                </div>
            </div>
        `;
        return;
    }

    // แสดงผลสินค้า
    data.forEach(function (item) {
        let className = "other";
        let medal = "";
        let bookmark = "";

        if (item.rank === 1) {
            className = "first";
            medal = "คุ้มที่สุด🥇";
            bookmark = '<div class="bookmark"></div>';
        } else if (item.rank === 2) {
            className = "second";
            medal = "🥈";
        }

        const result = document.createElement("div");
        result.className = "result-box " + className;

        result.innerHTML = `
            ${bookmark}
            <div class="result-text">
                <span class="medal">${medal}</span>

                สินค้าชิ้นที่ #${item.index + 1}
                <span class="result-name"><br>
                    ${escapeHTML(item.name)} : 
                </span>
                <span class="result-price">
                    ${formatNumber(item.total)} บาท
                </span>

      ${item.promotion === 10 ? `
          <br>
          ได้รับ:
          ${formatNumber(item.quantity + freeUnits)} หน่วย
` : ""}
            </div>
        `;

        results.appendChild(result);
    });
}


/* =========================================
   ป้องกัน HTML และจัดรูปแบบตัวเลข
========================================= */

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(number) {
    return number.toLocaleString("th-TH", {
        maximumFractionDigits: 2
    });
}


/* =========================================
   เปิดเว็บมาให้มี 1 กล่องสีขาว
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    addGroup();
});
