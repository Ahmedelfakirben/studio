"use client";

import React from "react";

interface BonRecepcion {
  id: string;
  numero: string;
  fecha: string;
  referenciaProyecto?: string;
  proveedor: {
    razonSocial: string;
    direccion: string;
    numeroTVA?: string;
  };
  lineasMaterial: Array<{
    numeroPrix: string;
    designacion: string;
    unidad: string;
    cantidad: number;
  }>;
}

interface BonRecepcionPrintProps {
  bonRecepcion: BonRecepcion;
}

export function BonRecepcionPrint({ bonRecepcion }: BonRecepcionPrintProps) {
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

        .signatures {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          margin-top: 80px;
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

        .note-section {
          background: #fffbeb;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 30px 0;
          border-radius: 4px;
        }

        .note-section strong {
          color: #f59e0b;
          font-size: 11px;
          text-transform: uppercase;
        }

        .note-section p {
          font-size: 10px;
          margin-top: 5px;
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
          <h1>BON DE RÉCEPTION</h1>
          <div className="facture-numero">{bonRecepcion.numero}</div>
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
            <div className="name">{bonRecepcion.cliente.razonSocial}</div>
            <div>{bonRecepcion.cliente.direccion}</div>
            {bonRecepcion.cliente.numeroTVA && (
              <div>N° TVA: {bonRecepcion.cliente.numeroTVA}</div>
            )}
          </div>
        </div>
      </div>

      <div className="facture-meta">
        <div className="meta-item">
          <strong>Date:</strong>{' '}
          {new Date(bonRecepcion.fecha).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </div>
        {bonRecepcion.referenciaProyecto && (
          <div className="meta-item">
            <strong>Référence Projet:</strong> {bonRecepcion.referenciaProyecto}
          </div>
        )}
        <div className="meta-item">
          <strong>N° Bon Réception:</strong> {bonRecepcion.numero}
        </div>
      </div>

      <table className="details-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>N° PRIX</th>
            <th>DÉSIGNATION DES MATÉRIAUX</th>
            <th style={{ width: '100px' }}>UNITÉ</th>
            <th className="text-right" style={{ width: '120px' }}>QUANTITÉ</th>
          </tr>
        </thead>
        <tbody>
          {bonRecepcion.lineasMaterial.map((linea, index) => (
            <tr key={index}>
              <td className="font-medium">{linea.numeroPrix}</td>
              <td>{linea.designacion}</td>
              <td>{linea.unidad}</td>
              <td className="text-right font-medium">{linea.cantidad.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="note-section">
        <strong>Note:</strong>
        <p>
          Ce bon de livraison atteste de la réception des matériaux listés ci-dessus.
          Les matériaux ont été livrés en bon état et selon les quantités indiquées.
        </p>
      </div>

      <div className="signatures">
        <div className="signature-box">
          <div className="signature-label">Le Fournisseur</div>
          <div className="signature-line">Cachet et Signature</div>
        </div>
        <div className="signature-box">
          <div className="signature-label">Le Client (Réception)</div>
          <div className="signature-line">Nom, Cachet et Signature</div>
        </div>
      </div>

      <div className="footer">
        <p>A.L.Y TRAVAUX PUBLIQUE - Bon de livraison - Document généré électroniquement</p>
      </div>
    </div>
  );
}
