"use client";

import React from "react";

interface FacturaAchat {
  id: string;
  numero: string;
  fecha: string;
  referenciaProyecto?: string;
  proveedor: {
    razonSocial: string;
    direccion: string;
    numeroTVA?: string;
  };
  lineasDetalle: Array<{
    numeroPrix: string;
    designacion: string;
    unidad: string;
    cantidad: number;
    precioUnitario: number;
    montoHT: number;
  }>;
  montoHT: number;
  montTVA: number;
  montoTTC: number;
}

interface FacturaAchatPrintProps {
  facturaAchat: FacturaAchat;
}

export function FacturaAchatPrint({ factura }: FacturaAchatPrintProps) {
  // Convertir número a letras en francés (simplificado)
  const numeroALetras = (num: number): string => {
    const unidades = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const dizaines = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
    const especiales = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];

    const entero = Math.floor(num);
    const decimales = Math.round((num - entero) * 100);

    if (entero === 0) return 'zéro dirhams';

    let resultado = '';

    // Millares
    if (entero >= 1000) {
      const millares = Math.floor(entero / 1000);
      resultado += (millares === 1 ? 'mille' : numeroALetras(millares) + ' mille') + ' ';
    }

    const resto = entero % 1000;

    // Centenas
    if (resto >= 100) {
      const centenas = Math.floor(resto / 100);
      if (centenas === 1) {
        resultado += 'cent ';
      } else {
        resultado += unidades[centenas] + ' cent ';
      }
    }

    const restoDecenas = resto % 100;

    // Dizaines y unidades
    if (restoDecenas >= 17 || restoDecenas === 10) {
      const d = Math.floor(restoDecenas / 10);
      const u = restoDecenas % 10;
      resultado += dizaines[d];
      if (u > 0) {
        resultado += '-' + unidades[u];
      }
    } else if (restoDecenas >= 10) {
      resultado += especiales[restoDecenas - 10];
    } else if (restoDecenas > 0) {
      resultado += unidades[restoDecenas];
    }

    resultado += ' dirhams';

    if (decimales > 0) {
      resultado += ' et ' + decimales + ' centimes';
    }

    return resultado.trim();
  };

  return (
    <div className="facture-print">
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }

          body * {
            visibility: hidden;
          }

          .facture-print,
          .facture-print * {
            visibility: visible;
          }

          .facture-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }

          .no-print {
            display: none !important;
          }
        }

        .facture-print {
          max-width: 210mm;
          margin: 0 auto;
          padding: 20mm;
          background: white;
          font-family: 'Arial', sans-serif;
          color: #000;
          line-height: 1.4;
        }

        .facture-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #2563eb;
        }

        .company-info {
          flex: 1;
        }

        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 5px;
        }

        .company-details {
          font-size: 11px;
          color: #666;
        }

        .facture-title {
          text-align: right;
        }

        .facture-title h1 {
          font-size: 32px;
          font-weight: bold;
          color: #2563eb;
          margin: 0 0 10px 0;
        }

        .facture-numero {
          font-size: 14px;
          font-weight: bold;
          background: #2563eb;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          display: inline-block;
        }

        .parties-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .partie {
          background: #f8fafc;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #2563eb;
        }

        .partie-title {
          font-size: 12px;
          font-weight: bold;
          color: #2563eb;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .partie-content {
          font-size: 11px;
        }

        .partie-content .name {
          font-size: 13px;
          font-weight: bold;
          color: #000;
          margin-bottom: 5px;
        }

        .facture-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 15px;
          background: #f8fafc;
          border-radius: 4px;
          font-size: 11px;
        }

        .meta-item strong {
          font-weight: bold;
          color: #2563eb;
        }

        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 11px;
        }

        .details-table thead {
          background: #2563eb;
          color: white;
        }

        .details-table th {
          padding: 12px 8px;
          text-align: left;
          font-weight: bold;
          font-size: 10px;
          text-transform: uppercase;
        }

        .details-table th.text-right {
          text-align: right;
        }

        .details-table tbody tr {
          border-bottom: 1px solid #e2e8f0;
        }

        .details-table tbody tr:hover {
          background: #f8fafc;
        }

        .details-table td {
          padding: 10px 8px;
          vertical-align: top;
        }

        .details-table td.text-right {
          text-align: right;
        }

        .details-table td.font-medium {
          font-weight: 600;
        }

        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
        }

        .totals-table {
          width: 300px;
          font-size: 12px;
        }

        .totals-table tr {
          border-bottom: 1px solid #e2e8f0;
        }

        .totals-table td {
          padding: 8px;
        }

        .totals-table td:first-child {
          font-weight: bold;
        }

        .totals-table td:last-child {
          text-align: right;
          font-weight: 600;
        }

        .totals-table .total-final {
          background: #2563eb;
          color: white;
          font-size: 14px;
        }

        .total-final td {
          padding: 12px 8px;
          font-weight: bold;
        }

        .total-letras {
          background: #f8fafc;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 30px;
          border-left: 4px solid #2563eb;
        }

        .total-letras-label {
          font-size: 10px;
          color: #666;
          margin-bottom: 5px;
        }

        .total-letras-value {
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .signatures {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          margin-top: 50px;
          page-break-inside: avoid;
        }

        .signature-box {
          text-align: center;
        }

        .signature-label {
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 60px;
        }

        .signature-line {
          border-top: 2px solid #000;
          padding-top: 5px;
          font-size: 9px;
          color: #666;
        }

        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          text-align: center;
          font-size: 9px;
          color: #666;
        }
      `}</style>

      <div className="facture-header">
        <div className="company-info">
          <div className="company-name">A.L.Y TRAVAUX PUBLIQUE</div>
          <div className="company-details">
            <div>ICE: [Votre ICE]</div>
            <div>N° TVA: [Votre N° TVA]</div>
            <div>Adresse: [Votre Adresse]</div>
            <div>Tél: [Votre Téléphone]</div>
          </div>
        </div>
        <div className="facture-title">
          <h1>FACTURE D'ACHAT</h1>
          <div className="facture-numero">{facturaAchat.numero}</div>
        </div>
      </div>

      <div className="parties-info">
        <div className="partie">
          <div className="partie-title">Fournisseur</div>
          <div className="partie-content">
            <div className="name">A.L.Y TRAVAUX PUBLIQUE</div>
            <div>[Votre Adresse Complète]</div>
            <div>N° TVA: [Votre N° TVA]</div>
          </div>
        </div>

        <div className="partie">
          <div className="partie-title">Client</div>
          <div className="partie-content">
            <div className="name">{facturaAchat.cliente.razonSocial}</div>
            <div>{facturaAchat.cliente.direccion}</div>
            {facturaAchat.cliente.numeroTVA && (
              <div>N° TVA: {facturaAchat.cliente.numeroTVA}</div>
            )}
          </div>
        </div>
      </div>

      <div className="facture-meta">
        <div className="meta-item">
          <strong>Date:</strong>{' '}
          {new Date(facturaAchat.fecha).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </div>
        {facturaAchat.referenciaProyecto && (
          <div className="meta-item">
            <strong>Référence Projet:</strong> {facturaAchat.referenciaProyecto}
          </div>
        )}
        <div className="meta-item">
          <strong>N° Facture:</strong> {facturaAchat.numero}
        </div>
      </div>

      <table className="details-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>N° PRIX</th>
            <th>DÉSIGNATION DES OUVRAGES</th>
            <th style={{ width: '80px' }}>UNITÉ</th>
            <th className="text-right" style={{ width: '90px' }}>QUANTITÉ</th>
            <th className="text-right" style={{ width: '100px' }}>PRIX U. HT</th>
            <th className="text-right" style={{ width: '110px' }}>MONTANT HT</th>
          </tr>
        </thead>
        <tbody>
          {facturaAchat.lineasDetalle.map((linea, index) => (
            <tr key={index}>
              <td className="font-medium">{linea.numeroPrix}</td>
              <td>{linea.designacion}</td>
              <td>{linea.unidad}</td>
              <td className="text-right">{linea.cantidad.toFixed(2)}</td>
              <td className="text-right">{linea.precioUnitario.toFixed(2)}</td>
              <td className="text-right font-medium">{linea.montoHT.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals-section">
        <table className="totals-table">
          <tbody>
            <tr>
              <td>Montant HT:</td>
              <td>{facturaAchat.montoHT.toFixed(2)} MAD</td>
            </tr>
            <tr>
              <td>TVA (20%):</td>
              <td>{facturaAchat.montTVA.toFixed(2)} MAD</td>
            </tr>
            <tr className="total-final">
              <td>Montant TTC:</td>
              <td>{facturaAchat.montoTTC.toFixed(2)} MAD</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="total-letras">
        <div className="total-letras-label">
          Arrêté la présente facture à la somme de:
        </div>
        <div className="total-letras-value">
          {numeroALetras(facturaAchat.montoTTC)}
        </div>
      </div>

      <div className="signatures">
        <div className="signature-box">
          <div className="signature-label">Le Fournisseur</div>
          <div className="signature-line">Cachet et Signature</div>
        </div>
        <div className="signature-box">
          <div className="signature-label">Le Client</div>
          <div className="signature-line">Cachet et Signature</div>
        </div>
      </div>

      <div className="footer">
        <p>A.L.Y TRAVAUX PUBLIQUE - Document généré électroniquement</p>
      </div>
    </div>
  );
}
