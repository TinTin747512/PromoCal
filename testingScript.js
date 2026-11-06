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
                    <option value="0">ไม่มีโปรโมชั่น(ไม่ต้องกรอก x กับ y)</option>
                    <option value="1">1.ลด X บาท ต่อชิ้น</option>
                    <option value="2">2.ลด X%</option>
                    <option value="3">3.ซื้อ X หน่วย ราคา Y บาท</option>
                    <option value="4">4.ซื้อ X หน่วย ลด Y บาท</option>
                    <option value="5">5.ซื้อ X หน่วยขึ้นไป ลด Y บาท</option>
                    <option value="6">6.ซื้อ X หน่วย ลด Y%</option>
                    <option value="7">7.ซื้อ X หน่วยขึ้นไป ลด Y%</option>
                    <option value="8">8.ซื้อ X หน่วย เหลือหน่วยละ Y บาท</option>
                    <option value="9">9.ซื้อ X หน่วยขึ้นไป เหลือหน่วยละ Y บาท</option>
                    <option value="10">10.ซื้อ X แถม Y</option>
                    <option value="11">11.ซื้อครบ X บาท ลด Y บาท</option>
                    <option value="12">12.ซื้อครบ X บาท ลด Y%</option>
                    <option value="13">13.ราคาสมาชิก X บาท</option>
                </select>
            </div>

            <div class="promo-values">
                <input type="number" class="promo-x"
                       placeholder="ค่า X" min="0" step="any">
                <input type="number" class="promo-y"
                       placeholder="ค่า Y (ไม่จำเป็น)" min="0" step="any">
            </div>
        </div>
    `;

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

        case 1: // ลด X บาทต่อชิ้น
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
        const x = Number(product.querySelector(".promo-x").value) || 0;
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

        data.push({
            index: index,
            name: name,
            total: total
        });
    });

    // เรียงสินค้าจากราคาถูกไปแพง
    data.sort(function (a, b) {
        return a.total - b.total;
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
            medal = "🥇";
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
                อันดับ ${item.rank}
                <span class="medal">${medal}</span>
                <br>
                สินค้าชิ้นที่ #${item.index + 1} :
                <span class="result-name">
                    ${escapeHTML(item.name)}
                </span>
                <br>
                <span class="result-price">
                    ${formatNumber(item.total)} บาท
                </span>
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
