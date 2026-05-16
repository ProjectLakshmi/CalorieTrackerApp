import React from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function BarcodeScanner({ onScan }) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">Scan Barcode 📦</h3>

      <BarcodeScannerComponent
        width={300}
        height={300}
        onUpdate={(err, result) => {
          if (result) {
            onScan(result.text); // send barcode to parent
          }
        }}
      />
    </div>
  );
}

export default BarcodeScanner;