package com.busfinance.service;

import com.busfinance.entity.DailyFinance;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfReportService {

    private static final Color SUCCESS_COLOR = new Color(25, 135, 84); // Green
    private static final Color DANGER_COLOR = new Color(220, 53, 69);  // Red
    private static final Color DARK_BG = new Color(52, 58, 64);        // Dark Grey/Black

    public ByteArrayInputStream generateFinancePdf(DailyFinance finance) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Font Styles
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.BLACK);
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            Font sectionHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.BLACK);
            Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.GRAY);
            Font valueFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.BLACK);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.BLACK);
            Font boldBodyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.BLACK);

            // --- HEADER SECTION ---
            Paragraph titlePara = new Paragraph("DAILY FINANCIAL REPORT", titleFont);
            titlePara.setAlignment(Element.ALIGN_CENTER);
            document.add(titlePara);

            Paragraph systemPara = new Paragraph("Bus Finance Management System", subTitleFont);
            systemPara.setAlignment(Element.ALIGN_CENTER);
            systemPara.setSpacingBefore(-5);
            document.add(systemPara);

            document.add(new Paragraph("\n"));
            drawSubtleDivider(document);
            document.add(new Paragraph("\n"));

            // --- METADATA ---
            PdfPTable metaTable = new PdfPTable(3);
            metaTable.setWidthPercentage(90);
            metaTable.setHorizontalAlignment(Element.ALIGN_CENTER);
            
            addCardDetail(metaTable, "Statement ID", "#" + finance.getId(), labelFont, valueFont);
            addCardDetail(metaTable, "Trip Date", finance.getDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), labelFont, valueFont);
            if (finance.getRoute() != null) {
                addCardDetail(metaTable, "Route Name", finance.getRoute().getRouteName(), labelFont, valueFont);
            } else {
                addCardDetail(metaTable, "Route Name", "-", labelFont, valueFont);
            }
            
            document.add(metaTable);
            document.add(new Paragraph("\n\n"));

            // --- CREW ASSIGNMENT & PAYMENTS ---
            addSectionHeading(document, "CREW ASSIGNMENT & PAYMENTS", sectionHeaderFont);
            PdfPTable crewTable = new PdfPTable(5);
            crewTable.setWidthPercentage(100);
            crewTable.setSpacingBefore(10);
            crewTable.setWidths(new float[]{1.5f, 2.5f, 1.5f, 1.5f, 1.5f});

            addPremiumTableHeader(crewTable, "Role", tableHeaderFont);
            addPremiumTableHeader(crewTable, "Staff Name", tableHeaderFont);
            addPremiumTableHeader(crewTable, "Fixed Salary", tableHeaderFont);
            addPremiumTableHeader(crewTable, "Paid Amount", tableHeaderFont);
            addPremiumTableHeader(crewTable, "Balance", tableHeaderFont);

            // Driver
            addPremiumTableRow(crewTable, "Driver", finance.getDriverName(), 
                finance.getRoute() != null ? finance.getRoute().getDriverSalary() : 0.0, 
                finance.getDriverSalaryPaid(), finance.getDriverBalanceSalary(), bodyFont, boldBodyFont);
            
            // Conductor
            addPremiumTableRow(crewTable, "Conductor", finance.getConductorName(), 
                finance.getRoute() != null ? finance.getRoute().getConductorSalary() : 0.0, 
                finance.getConductorSalaryPaid(), finance.getConductorBalanceSalary(), bodyFont, boldBodyFont);
            
            // Cleaner
            addPremiumTableRow(crewTable, "Cleaner", finance.getCleanerName(), 
                finance.getRoute() != null ? finance.getRoute().getCleanerSalary() : 0.0, 
                finance.getCleanerPadi(), finance.getCleanerBalanceSalary(), bodyFont, boldBodyFont);

            document.add(crewTable);
            document.add(new Paragraph("\n\n"));

            // --- COLLECTION SUMMARY ---
            addSectionHeading(document, "COLLECTION SUMMARY", sectionHeaderFont);
            PdfPTable collTable = new PdfPTable(1);
            collTable.setWidthPercentage(60);
            collTable.setSpacingBefore(10);
            collTable.setHorizontalAlignment(Element.ALIGN_CENTER);
            
            addCenteredInfoRow(collTable, "Total Collection : " + formatCurrencyBold(finance.getTotalCollection()), boldBodyFont);
            addCenteredInfoRow(collTable, "Status : Trip Complete", bodyFont);
            
            document.add(collTable);
            document.add(new Paragraph("\n\n"));

            // --- EXPENSE BREAKDOWN ---
            addSectionHeading(document, "EXPENSE BREAKDOWN", sectionHeaderFont);
            PdfPTable expTable = new PdfPTable(2);
            expTable.setWidthPercentage(50);
            expTable.setSpacingBefore(10);
            expTable.setHorizontalAlignment(Element.ALIGN_CENTER);
            
            addExpenseRow(expTable, "Diesel (Fuel)", formatCurrencyBold(finance.getDieselExpense()), bodyFont, boldBodyFont);
            addExpenseRow(expTable, "Union Fee", formatCurrencyBold(finance.getUnionFee()), bodyFont, boldBodyFont);
            addExpenseRow(expTable, "Other (PooSelavu)", formatCurrencyBold(finance.getPooSelavu()), bodyFont, boldBodyFont);
            
            document.add(expTable);
            document.add(new Paragraph("\n\n"));

            // --- FINANCIAL SUMMARY ---
            addSectionHeading(document, "FINANCIAL SUMMARY", sectionHeaderFont);
            
            PdfPTable summaryTable = new PdfPTable(1);
            summaryTable.setWidthPercentage(70);
            summaryTable.setHorizontalAlignment(Element.ALIGN_CENTER);

            PdfPCell summaryCell = new PdfPCell();
            summaryCell.setBackgroundColor(new Color(248, 249, 250));
            summaryCell.setPadding(15);
            summaryCell.setBorderColor(new Color(222, 226, 230));
            summaryCell.setBorder(Rectangle.BOX);

            Paragraph sumCol = new Paragraph("Total Collection : " + formatCurrencyBold(finance.getTotalCollection()), boldBodyFont);
            sumCol.setAlignment(Element.ALIGN_CENTER);
            summaryCell.addElement(sumCol);

            double totalExp = (finance.getDriverSalaryPaid() != null ? finance.getDriverSalaryPaid() : 0) + 
                             (finance.getConductorSalaryPaid() != null ? finance.getConductorSalaryPaid() : 0) + 
                             (finance.getCleanerPadi() != null ? finance.getCleanerPadi() : 0) + 
                             (finance.getDieselExpense() != null ? finance.getDieselExpense() : 0) + 
                             (finance.getUnionFee() != null ? finance.getUnionFee() : 0) + 
                             (finance.getPooSelavu() != null ? finance.getPooSelavu() : 0);
                             
            Paragraph sumExp = new Paragraph("Total Expenses : " + formatCurrencyBold(totalExp), boldBodyFont);
            sumExp.setAlignment(Element.ALIGN_CENTER);
            summaryCell.addElement(sumExp);

            // Large Profit/Loss label
            boolean isProfit = finance.getBalance() != null && finance.getBalance() >= 0;
            Color statusColor = isProfit ? SUCCESS_COLOR : DANGER_COLOR;
            Font highlightFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, statusColor);
            
            String label = isProfit ? "NET PROFIT" : "NET LOSS";
            String valStr = formatCurrency(Math.abs(finance.getBalance() != null ? finance.getBalance() : 0));
            
            Paragraph finalResult = new Paragraph(label + " : " + valStr, highlightFont);
            finalResult.setAlignment(Element.ALIGN_CENTER);
            finalResult.setSpacingBefore(10);
            summaryCell.addElement(finalResult);

            summaryTable.addCell(summaryCell);
            document.add(summaryTable);

            document.close();
        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void drawSubtleDivider(Document document) throws DocumentException {
        PdfPTable line = new PdfPTable(1);
        line.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.BOTTOM);
        cell.setBorderWidthBottom(1f);
        cell.setBorderColorBottom(new Color(233, 236, 239));
        line.addCell(cell);
        document.add(line);
    }

    private void addCardDetail(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        
        Paragraph pLabel = new Paragraph(label.toUpperCase(), labelFont);
        pLabel.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(pLabel);
        
        Paragraph pValue = new Paragraph(value != null ? value : "-", valueFont);
        pValue.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(pValue);
        
        table.addCell(cell);
    }

    private void addSectionHeading(Document document, String title, Font font) throws DocumentException {
        Paragraph p = new Paragraph(title, font);
        p.setAlignment(Element.ALIGN_CENTER);
        p.setSpacingBefore(15);
        p.setSpacingAfter(5);
        document.add(p);
    }

    private void addPremiumTableHeader(PdfPTable table, String text, Font font) {
        PdfPCell header = new PdfPCell(new Phrase(text, font));
        header.setBackgroundColor(DARK_BG);
        header.setHorizontalAlignment(Element.ALIGN_CENTER);
        header.setVerticalAlignment(Element.ALIGN_MIDDLE);
        header.setPadding(8);
        header.setBorderColor(new Color(73, 80, 87));
        table.addCell(header);
    }

    private void addPremiumTableRow(PdfPTable table, String role, String name, Double salary, Double paid, Double balance, Font font, Font boldFont) {
        table.addCell(createCell(role, font, Element.ALIGN_CENTER, null));
        table.addCell(createCell(name != null ? name : "-", font, Element.ALIGN_CENTER, null));
        table.addCell(createCell(formatCurrencyBold(salary), boldFont, Element.ALIGN_CENTER, null));
        table.addCell(createCell(formatCurrencyBold(paid), boldFont, Element.ALIGN_CENTER, null));
        
        // Conditional Balance Color
        double bal = balance != null ? balance : 0.0;
        Color balColor = bal > 0 ? SUCCESS_COLOR : (bal < 0 ? DANGER_COLOR : Color.BLACK);
        Font balFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, balColor);
        
        table.addCell(createCell(formatCurrency(bal), balFont, Element.ALIGN_CENTER, null));
    }

    private PdfPCell createCell(String text, Font font, int align, Color bgColor) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        if (bgColor != null) cell.setBackgroundColor(bgColor);
        cell.setPadding(8);
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorderColor(new Color(233, 236, 239));
        return cell;
    }

    private void addCenteredInfoRow(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(4);
        table.addCell(cell);
    }

    private void addExpenseRow(PdfPTable table, String type, String amount, Font font, Font boldFont) {
        PdfPCell cellType = new PdfPCell(new Phrase(type, font));
        cellType.setBorder(Rectangle.BOTTOM);
        cellType.setBorderColor(new Color(241, 243, 245));
        cellType.setPadding(6);
        table.addCell(cellType);

        PdfPCell cellAmt = new PdfPCell(new Phrase(amount, boldFont));
        cellAmt.setBorder(Rectangle.BOTTOM);
        cellAmt.setBorderColor(new Color(241, 243, 245));
        cellAmt.setHorizontalAlignment(Element.ALIGN_RIGHT);
        cellAmt.setPadding(6);
        table.addCell(cellAmt);
    }

    private String formatCurrency(Double val) {
        if (val == null) return "0";
        if (val == 0) return "0";
        return String.format("%.2f", val);
    }

    private String formatCurrencyBold(Double val) {
        return formatCurrency(val);
    }
}

