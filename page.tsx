"use client";

import React, { useState, useEffect } from "react";

interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export default function InvoiceApp() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [template, setTemplate] = useState("basic");

  // Load saved invoice
  useEffect(() => {
    const saved = localStorage.getItem("invoiceData");
    if (saved) {
      const data = JSON.parse(saved);
      setItems(data.items || []);
      setClientName(data.clientName || "");
      setInvoiceNumber(data.invoiceNumber || "");
      setDueDate(data.dueDate || "");
      setNotes(data.notes || "");
      setLogoUrl(data.logoUrl || "");
      setTemplate(data.template || "basic");
    }
  }, []);

  const saveInvoice = () => {
    const data = {
      items,
      clientName,
      invoiceNumber,
      dueDate,
      notes,
      logoUrl,
      template,
    };
    localStorage.setItem("invoiceData", JSON.stringify(data));
  };

  const handleAddItem = () => {
    if (!name || quantity <= 0 || price <= 0) return;

    const newItem: InvoiceItem = {
      id: Date.now(),
      name,
      quantity,
      price,
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setName("");
    setQuantity(1);
    setPrice(0);
    saveInvoice();
  };

  const handleRemoveItem = (id: number) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    saveInvoice();
  };

  const handleClear = () => {
    setItems([]);
    setName("");
    setQuantity(1);
    setPrice(0);
    setClientName("");
    setInvoiceNumber("");
    setDueDate("");
    setNotes("");
    setLogoUrl("");
    setTemplate("basic");
    localStorage.removeItem("invoiceData");
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white min-h-screen">
      {logoUrl && (
        <img src={logoUrl} alt="Logo" className="h-16 mb-4 object-contain" />
      )}
      <h1 className="text-2xl font-bold mb-4">Invoice App</h1>

      {/* Invoice info display */}
      <div className="mb-6 text-gray-700 space-y-1">
        {clientName && <p><strong>Client:</strong> {clientName}</p>}
        {invoiceNumber && <p><strong>Invoice #:</strong> {invoiceNumber}</p>}
        {dueDate && <p><strong>Due Date:</strong> {dueDate}</p>}
      </div>

      {/* Template Switcher */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Template</label>
        <select
          className="border p-2 w-full"
          value={template}
          onChange={(e) => {
            setTemplate(e.target.value);
            saveInvoice();
          }}
        >
          <option value="basic">Basic Template</option>
          <option value="modern">Modern Template</option>
        </select>
      </div>

      {/* Form */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Client Name"
          className="w-full border p-2"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Invoice Number"
          className="w-full border p-2"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
        />
        <input
          type="date"
          className="w-full border p-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Logo Image URL"
          className="w-full border p-2"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
        />
        <textarea
          placeholder="Additional Notes"
          className="w-full border p-2"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <input
          type="text"
          placeholder="Item name"
          className="w-full border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="w-full border p-2"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full border p-2"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>

      {/* Items */}
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex justify-between items-center border-b py-2">
            <div>
              {item.name} – {item.quantity} × ${item.price.toFixed(2)}
            </div>
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="text-red-500"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6">Total: ${total.toFixed(2)}</h2>

      {notes && (
        <div className="mt-4 text-gray-700 whitespace-pre-wrap">
          <strong>Notes:</strong>
          <p>{notes}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleClear}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Invoice
        </button>
        <button
          onClick={() => window.print()}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Print / Export
        </button>
      </div>
    </div>
  );
}


