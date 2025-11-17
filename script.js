const completeList = document.querySelector("ul");
const poInput = document.getElementById("poInput");
const itemInput = document.getElementById("itemInput");
const sumBtn = document.getElementById("sumBtn");
const resultDiv = document.getElementById("result");

let pr_list = []; // keep data accessible outside fetch

fetch("./items.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("No data");
    }
    return response.json();
  })
  .then((data) => {
    pr_list = data; // store globally
    console.log(pr_list);

    pr_list.forEach((order) => {
      const orderEl = document.createElement("li");
      orderEl.className = "supplier-block";

      const orderNumber = document.createElement("h2");
      orderNumber.innerText = order.purchase_order_number;

      const supplierName = document.createElement("h2");
      supplierName.innerText = order.supplier;

      orderEl.appendChild(supplierName);
      orderEl.appendChild(orderNumber);

      order.items.forEach((item) => {
        const itemList = document.createElement("li");
        itemList.className = "item-list";

        const itemCode = document.createElement("p");
        const itemName = document.createElement("p");
        const batchNumber = document.createElement("p");
        const qty = document.createElement("p");

        itemCode.innerText = `Item code: ${item.item_code}`;
        itemName.innerText = `Item name: ${item.item_name}`;
        batchNumber.innerText = `Batch number: ${item.batch_number}`;
        qty.innerText = `Quantity: ${item.quantity}`;

        itemList.appendChild(itemName);
        itemList.appendChild(itemCode);
        itemList.appendChild(batchNumber);
        itemList.appendChild(qty);

        orderEl.appendChild(itemList);
      });

      completeList.appendChild(orderEl);
    });
  })
  .catch((error) => console.error(error));

// Summing logic
sumBtn.addEventListener("click", () => {
  const poNumber = poInput.value.trim();
  const itemCode = itemInput.value.trim();

  let totalQty = 0;

  pr_list.forEach((order) => {
    // If PO matches (or leave blank to match all)
    if (poNumber === "" || order.purchase_order_number === poNumber) {
      order.items.forEach((item) => {
        if (item.item_code === itemCode) {
          totalQty += item.quantity;
        }
      });
    }
  });

  resultDiv.innerText = `Total quantity for ${itemCode} (PO: ${
    poNumber || "ALL"
  }): ${totalQty}`;
});

// Wrong
const poInputWrong = document.getElementById("poInputWrong");
const itemInputWrong = document.getElementById("itemInputWrong");
const sumBtnWrong = document.getElementById("sumBtnWrong");
const resultDivWrong = document.getElementById("resultWrong");

// Wrong logic
sumBtnWrong.addEventListener("click", () => {
  const poNumber = poInputWrong.value.trim(); // entered but ignored
  const itemCode = itemInputWrong.value.trim();

  let totalQtyWrong = 0;

  pr_list.forEach((order) => {
    order.items.forEach((item) => {
      // ignore poNumber
      if (item.item_code === itemCode) {
        totalQtyWrong += item.quantity;
      }
    });
  });

  resultDivWrong.innerText = `Total quantity for ${itemCode} (PO: ${poNumber}): ${totalQtyWrong}`;
});
