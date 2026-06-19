// PDF Report Generator using jsPDF
// Generates a professional, formatted PDF report from company data

import jsPDF from 'jspdf';
import { CompanyData } from '../types';

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  for (let i = 0; i < lines.length; i++) {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
    doc.text(lines[i], x, y);
    y += lineHeight;
  }
  return y;
}

function addSectionHeader(doc: jsPDF, text: string, y: number): number {
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  // Blue bar
  doc.setFillColor(6, 182, 212);
  doc.rect(15, y - 5, 3, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(6, 182, 212);
  doc.text(text, 22, y);
  doc.setTextColor(50, 50, 50);
  // Line under header
  doc.setDrawColor(220, 220, 220);
  doc.line(15, y + 2, 195, y + 2);
  return y + 8;
}

function addBulletItem(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  bullet: string = '•'
): number {
  if (y > 275) {
    doc.addPage();
    y = 20;
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(bullet, x, y);
  const lines = doc.splitTextToSize(text, maxWidth - 8);
  for (let i = 0; i < lines.length; i++) {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
    doc.text(lines[i], x + 6, y);
    y += 5;
  }
  return y;
}

export function generatePDFReport(data: CompanyData): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const contentWidth = 180;
  const leftMargin = 15;

  // ==================== TITLE PAGE ====================
  // Background gradient simulation (top bar)
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 0, pageWidth, 3, 'F');

  // Logo area
  doc.setFillColor(6, 182, 212);
  doc.roundedRect(80, 30, 50, 50, 8, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text('S', 97, 62);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(30, 30, 30);
  doc.text('StrategicAI', pageWidth / 2, 100, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(6, 182, 212);
  doc.text('Company Intelligence Report', pageWidth / 2, 110, { align: 'center' });

  // Divider
  doc.setDrawColor(6, 182, 212);
  doc.setLineWidth(0.5);
  doc.line(70, 116, 140, 116);

  // Company name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text(data.name, pageWidth / 2, 132, { align: 'center' });

  // Meta info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, pageWidth / 2, 142, { align: 'center' });
  doc.text('Powered by Wikipedia • Wikidata • Jina AI Reader • BAAI/bge-small-en-v1.5', pageWidth / 2, 149, { align: 'center' });

  // Data source badges
  let badgeY = 160;
  doc.setFontSize(9);
  if (data.wikipediaUrl) {
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(55, badgeY - 3, 44, 7, 2, 2, 'F');
    doc.setTextColor(22, 163, 74);
    doc.text('Wikipedia ✓', 77, badgeY + 1, { align: 'center' });
  }
  if (data.wikidataId) {
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(103, badgeY - 3, 40, 7, 2, 2, 'F');
    doc.setTextColor(22, 163, 74);
    doc.text('Wikidata ✓', 123, badgeY + 1, { align: 'center' });
  }
  if (data.websiteData?.scraped) {
    doc.setFillColor(250, 245, 255);
    doc.roundedRect(147, badgeY - 3, 48, 7, 2, 2, 'F');
    doc.setTextColor(147, 51, 234);
    doc.text(`Website (${data.websiteData.pagesScraped} pages)`, 171, badgeY + 1, { align: 'center' });
  }

  // Bottom bar
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 294, pageWidth, 3, 'F');

  // ==================== PAGE 2: COMPANY OVERVIEW ====================
  doc.addPage();
  let y = 20;

  y = addSectionHeader(doc, 'COMPANY OVERVIEW', y);
  y += 2;

  // Key facts in two columns
  const facts = [
    ['Industry', data.industry],
    ['Scale', data.scale],
    ['Founded', data.founded],
    ['Employees', data.employees],
    ['Website', data.website],
  ];

  // Draw facts in a grid
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y - 3, 85, facts.length * 8 + 4, 3, 3, 'F');
  doc.roundedRect(105, y - 3, 85, 3, 3, 3, 'F'); // placeholder for future content

  facts.forEach(([key, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(key.toUpperCase(), 18, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    const valLines = doc.splitTextToSize(value, 75);
    doc.text(valLines[0], 18, y + 7);
    y += 8;
  });

  y += 4;

  // Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.text('Summary', leftMargin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  y = addWrappedText(doc, data.description, leftMargin, y, contentWidth, 5);
  y += 4;

  // Locations
  if (data.locations.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(`Locations (${data.locations.length})`, leftMargin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    y = addWrappedText(doc, data.locations.join(', '), leftMargin, y, contentWidth, 5);
    y += 4;
  }

  // Leadership
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.text('Leadership', leftMargin, y);
  y += 5;
  data.leadership.forEach((leader) => {
    y = addBulletItem(doc, leader, leftMargin, y, contentWidth);
  });
  y += 2;

  // Stats from website
  if (data.websiteData?.statsFromWebsite && data.websiteData.statsFromWebsite.length > 0) {
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(147, 51, 234);
    doc.text('From Company Website', leftMargin, y);
    y += 5;
    data.websiteData.statsFromWebsite.forEach((stat) => {
      y = addBulletItem(doc, stat, leftMargin, y, contentWidth, '▸');
    });
    y += 2;
  }

  // ==================== BUSINESS INFORMATION ====================
  doc.addPage();
  y = 20;

  y = addSectionHeader(doc, 'BUSINESS INFORMATION', y);
  y += 2;

  // Offerings
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.text('Core Offerings', leftMargin, y);
  y += 5;
  data.offerings.forEach((offering) => {
    y = addBulletItem(doc, offering, leftMargin, y, contentWidth);
  });
  y += 3;

  // Projects
  if (data.projects.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text('Notable Projects', leftMargin, y);
    y += 5;
    data.projects.forEach((project) => {
      y = addBulletItem(doc, project, leftMargin, y, contentWidth);
    });
    y += 3;
  }

  // Recent News
  if (data.recentNews.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text('Key Developments', leftMargin, y);
    y += 5;
    data.recentNews.forEach((news, i) => {
      y = addBulletItem(doc, news, leftMargin, y, contentWidth, `${i + 1}.`);
    });
    y += 3;
  }

  // Expansion Plans
  if (data.expansionPlans.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text('Expansion & Growth Plans', leftMargin, y);
    y += 5;
    data.expansionPlans.forEach((plan) => {
      y = addBulletItem(doc, plan, leftMargin, y, contentWidth, '🚀');
    });
  }

  // ==================== CHALLENGES ====================
  doc.addPage();
  y = 20;

  y = addSectionHeader(doc, 'BUSINESS CHALLENGES', y);
  y += 2;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  y = addWrappedText(doc, 'Challenges identified through AI analysis of company data, market conditions, and growth trajectory', leftMargin, y, contentWidth, 4);
  y += 4;

  data.challenges.forEach((challenge, i) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    // Challenge box
    const severityColor = challenge.severity === 'high' ? [220, 38, 38] : challenge.severity === 'medium' ? [217, 119, 6] : [22, 163, 74];

    // Left border
    doc.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
    doc.rect(leftMargin, y - 3, 2, 6, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text(`${i + 1}. ${challenge.challenge}`, leftMargin + 5, y);

    // Severity badge
    doc.setFontSize(8);
    doc.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
    const badgeText = challenge.severity.toUpperCase();
    const badgeWidth = doc.getTextWidth(badgeText) + 6;
    doc.roundedRect(190 - badgeWidth, y - 4, badgeWidth, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(badgeText, 190 - badgeWidth + 3, y - 0.5);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    y = addWrappedText(doc, `Reason: ${challenge.reason}`, leftMargin + 5, y, contentWidth - 5, 5);
    y += 2;

    // Evidence
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(147, 51, 234);
    doc.text('Evidence:', leftMargin + 8, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    challenge.evidence.forEach((ev) => {
      y = addBulletItem(doc, ev, leftMargin + 8, y, contentWidth - 10, '‣');
    });
    y += 5;
  });

  // ==================== AI OPPORTUNITIES ====================
  doc.addPage();
  y = 20;

  y = addSectionHeader(doc, 'AI OPPORTUNITIES', y);
  y += 2;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  y = addWrappedText(doc, 'AI solutions ranked by Impact Score = (Impact + Feasibility + Urgency) / 3', leftMargin, y, contentWidth, 4);
  y += 4;

  // Impact scoring table
  doc.setFillColor(248, 250, 252);
  doc.rect(leftMargin, y - 2, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Solution', leftMargin + 2, y + 2);
  doc.text('Impact', 115, y + 2);
  doc.text('Feas.', 135, y + 2);
  doc.text('Urgency', 152, y + 2);
  doc.text('Score', 175, y + 2);
  y += 8;

  doc.setDrawColor(220, 220, 220);
  doc.line(leftMargin, y - 1, 195, y - 1);

  data.aiOpportunities.forEach((opp, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    // Alternating row background
    if (i % 2 === 0) {
      doc.setFillColor(250, 250, 255);
      doc.rect(leftMargin, y - 3, contentWidth, 10, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);

    const nameLines = doc.splitTextToSize(opp.solution, 95);
    doc.text(nameLines[0], leftMargin + 2, y);

    doc.setTextColor(6, 182, 212);
    doc.text(String(opp.impact), 120, y);
    doc.setTextColor(34, 197, 94);
    doc.text(String(opp.feasibility), 139, y);
    doc.setTextColor(249, 115, 22);
    doc.text(String(opp.urgency), 158, y);

    // Score with color
    const scoreColor = opp.totalScore >= 90 ? [22, 163, 74] : opp.totalScore >= 80 ? [6, 182, 212] : [217, 119, 6];
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    const scoreText = String(opp.totalScore);
    const sw = doc.getTextWidth(scoreText) + 6;
    doc.roundedRect(175, y - 3, sw, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(scoreText, 178, y);

    y += 10;
  });

  y += 4;

  // Detailed opportunities
  data.aiOpportunities.forEach((opp, i) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(6, 182, 212);
    doc.text(`${i + 1}. ${opp.solution}`, leftMargin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Addresses: ${opp.challenge}`, leftMargin + 4, y);
    y += 4;

    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    y = addWrappedText(doc, opp.description, leftMargin + 4, y, contentWidth - 4, 5);
    y += 5;
  });

  // ==================== CEO PITCH ====================
  doc.addPage();
  y = 20;

  y = addSectionHeader(doc, 'CEO PITCH', y);
  y += 2;

  const pitchLines = data.ceoPitch.split('\n');
  for (const line of pitchLines) {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }

    const trimmed = line.trim();
    if (trimmed === '') {
      y += 3;
      continue;
    }

    // Detect heading-like lines (ALL CAPS, short lines)
    const isHeading = trimmed.length < 40 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed) && !trimmed.startsWith('Dear') && !trimmed.startsWith('Best');

    if (isHeading) {
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(6, 182, 212);
      doc.text(trimmed, leftMargin, y);
      y += 6;
    } else if (trimmed.startsWith('Dear')) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.text(trimmed, leftMargin, y);
      y += 6;
    } else if (trimmed.startsWith('•')) {
      y = addBulletItem(doc, trimmed.substring(1).trim(), leftMargin, y, contentWidth);
      y += 1;
    } else if (trimmed.startsWith('→')) {
      y = addBulletItem(doc, trimmed.substring(1).trim(), leftMargin + 4, y, contentWidth - 4, '→');
      y += 1;
    } else if (trimmed.match(/^\d+\./)) {
      y = addBulletItem(doc, trimmed, leftMargin, y, contentWidth, trimmed.match(/^(\d+\.)/)?.[1] || '•');
      y += 1;
    } else if (trimmed.startsWith('Phase')) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(34, 197, 94);
      doc.text(trimmed, leftMargin + 4, y);
      y += 5;
    } else if (trimmed.startsWith('Best regards')) {
      y += 3;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(trimmed, leftMargin, y);
      y += 5;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      y = addWrappedText(doc, trimmed, leftMargin, y, contentWidth, 5);
    }
  }

  // ==================== FOOTER ON ALL PAGES ====================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Footer line
    doc.setDrawColor(220, 220, 220);
    doc.line(15, 288, 195, 288);
    // Footer text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text('StrategicAI — AI-Powered Company Intelligence Report', 15, 293);
    doc.text(`Page ${i} of ${totalPages}`, 195, 293, { align: 'right' });
    doc.text('Data: Wikipedia • Wikidata • Company Website — 100% Real Data', 105, 293, { align: 'center' });
  }

  // Save
  doc.save(`StrategicAI_Report_${data.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}
