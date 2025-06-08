'use client';

import { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { DocumentArrowDownIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface FormData {
  businessName: string;
  clientName: string;
  projectTitle: string;
  description: string;
  amount: string;
  date: string;
  logo: string | null;
  invoiceNumber: string;
  dueDate: string;
  terms: string;
  taxRate: string;
  taxAmount: string;
  totalAmount: string;
  paymentMethod: string;
  businessAddress: string;
  clientAddress: string;
  businessEmail: string;
  businessPhone: string;
  clientEmail: string;
  clientPhone: string;
  currency: string;
  items: InvoiceItem[];
  notes: string;
  status: 'draft' | 'sent' | 'paid';
  style: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: 'helvetica' | 'times' | 'courier' | 'arial';
    fontSize: 'small' | 'medium' | 'large';
    layout: 'standard' | 'compact' | 'detailed';
    headerStyle: 'centered' | 'left-aligned' | 'right-aligned';
    accentColor: string;
    showBorder: boolean;
    borderStyle: 'none' | 'solid' | 'dashed' | 'dotted';
    watermark: boolean;
    watermarkText: string;
    watermarkOpacity: number;
  };
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: string;
  rate: string;
  amount: string;
}

// Add this mapping object after the themes object
const fontMapping = {
  helvetica: {
    regular: StandardFonts.Helvetica,
    bold: StandardFonts.HelveticaBold
  },
  times: {
    regular: StandardFonts.TimesRoman,
    bold: StandardFonts.TimesRomanBold
  },
  courier: {
    regular: StandardFonts.Courier,
    bold: StandardFonts.CourierBold
  },
  arial: {
    regular: StandardFonts.Helvetica, // Arial is not available in StandardFonts, using Helvetica as fallback
    bold: StandardFonts.HelveticaBold
  }
};

// Add this helper function to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
};

// Remove the themes object and replace with a single style configuration
const defaultStyle = {
  primaryColor: '#1f2937',
  secondaryColor: '#111827',
  accentColor: '#4b5563',
  fontFamily: 'helvetica',
  fontSize: 'medium',
  layout: 'standard',
  headerStyle: 'left-aligned',
  showBorder: true,
  borderStyle: 'solid',
  watermark: false,
  watermarkText: 'CONFIDENTIAL',
  watermarkOpacity: 0.1
};

export default function CreatePage() {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    clientName: '',
    projectTitle: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    logo: null,
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    terms: 'Payment is due within 30 days',
    taxRate: '0',
    taxAmount: '0',
    totalAmount: '0',
    paymentMethod: 'Bank Transfer',
    businessAddress: '',
    businessEmail: '',
    businessPhone: '',
    clientAddress: '',
    clientEmail: '',
    clientPhone: '',
    currency: 'USD',
    items: [{ id: '1', description: '', quantity: '1', rate: '', amount: '0' }],
    notes: '',
    status: 'draft',
    style: defaultStyle
  });

  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear email and phone fields on component mount
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      businessEmail: '',
      businessPhone: '',
      clientEmail: '',
      clientPhone: '',
    }));
  }, []);

  const calculateTotals = (amount: string, taxRate: string) => {
    const amountNum = parseFloat(amount) || 0;
    const taxRateNum = parseFloat(taxRate) || 0;
    const taxAmount = (amountNum * taxRateNum) / 100;
    const totalAmount = amountNum + taxAmount;
    return {
      taxAmount: taxAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    };
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now().toString(),
          description: '',
          quantity: '1',
          rate: '',
          amount: '0',
        },
      ],
    }));
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string) => {
    setFormData(prev => {
      const newItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            const quantity = parseFloat(updatedItem.quantity) || 0;
            const rate = parseFloat(updatedItem.rate) || 0;
            updatedItem.amount = (quantity * rate).toFixed(2);
          }
          return updatedItem;
        }
        return item;
      });

      const subtotal = newItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      const taxAmount = (subtotal * parseFloat(prev.taxRate)) / 100;
      const totalAmount = subtotal + taxAmount;

      return {
        ...prev,
        items: newItems,
        amount: subtotal.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    
    // Handle nested style properties
    if (name.startsWith('style.')) {
      const styleProperty = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        style: {
          ...prev.style,
          [styleProperty]: value
        }
      }));
      return;
    }

    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'amount' || name === 'taxRate') {
        const { taxAmount, totalAmount } = calculateTotals(
          name === 'amount' ? value : prev.amount,
          name === 'taxRate' ? value : prev.taxRate
        );
        newData.taxAmount = taxAmount;
        newData.totalAmount = totalAmount;
      }
      return newData;
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add this shared function for PDF generation
  const generatePDFContent = async (pdfDoc: PDFDocument, isPreview: boolean = false) => {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    
    // Use the font mapping
    const font = await pdfDoc.embedFont(fontMapping[formData.style.fontFamily].regular);
    const boldFont = await pdfDoc.embedFont(fontMapping[formData.style.fontFamily].bold);

    // Convert colors to RGB
    const primaryColor = hexToRgb(formData.style.primaryColor);
    const secondaryColor = hexToRgb(formData.style.secondaryColor);
    const accentColor = hexToRgb(formData.style.accentColor);

    // Set up layout-specific parameters
    const layoutConfig = {
      standard: {
        margin: 50,
        lineHeight: formData.style.fontSize === 'small' ? 16 : formData.style.fontSize === 'large' ? 24 : 20,
        fontSize: formData.style.fontSize === 'small' ? 10 : formData.style.fontSize === 'large' ? 14 : 12,
        titleFontSize: formData.style.fontSize === 'small' ? 18 : formData.style.fontSize === 'large' ? 26 : 22,
        sectionSpacing: 2,
        contentSpacing: 1
      },
      compact: {
        margin: 40,
        lineHeight: formData.style.fontSize === 'small' ? 14 : formData.style.fontSize === 'large' ? 20 : 16,
        fontSize: formData.style.fontSize === 'small' ? 9 : formData.style.fontSize === 'large' ? 12 : 10,
        titleFontSize: formData.style.fontSize === 'small' ? 16 : formData.style.fontSize === 'large' ? 22 : 18,
        sectionSpacing: 1.5,
        contentSpacing: 0.5
      },
      detailed: {
        margin: 60,
        lineHeight: formData.style.fontSize === 'small' ? 18 : formData.style.fontSize === 'large' ? 26 : 22,
        fontSize: formData.style.fontSize === 'small' ? 11 : formData.style.fontSize === 'large' ? 15 : 13,
        titleFontSize: formData.style.fontSize === 'small' ? 20 : formData.style.fontSize === 'large' ? 28 : 24,
        sectionSpacing: 3,
        contentSpacing: 1.5
      }
    };

    const config = layoutConfig[formData.style.layout];
    let y = page.getHeight() - config.margin;

    // Add border if enabled
    if (formData.style.showBorder && formData.style.borderStyle !== 'none') {
      const borderWidth = 1;
      const borderColor = rgb(primaryColor.r, primaryColor.g, primaryColor.b);
      const borderStyle = formData.style.borderStyle;
      
      if (borderStyle === 'dashed') {
        // Draw dashed border
        for (let i = 0; i < page.getWidth(); i += 10) {
          page.drawLine({
            start: { x: i, y: config.margin },
            end: { x: i + 5, y: config.margin },
            thickness: borderWidth,
            color: borderColor,
          });
          page.drawLine({
            start: { x: i, y: page.getHeight() - config.margin },
            end: { x: i + 5, y: page.getHeight() - config.margin },
            thickness: borderWidth,
            color: borderColor,
          });
        }
        for (let i = config.margin; i < page.getHeight() - config.margin; i += 10) {
          page.drawLine({
            start: { x: config.margin, y: i },
            end: { x: config.margin, y: i + 5 },
            thickness: borderWidth,
            color: borderColor,
          });
          page.drawLine({
            start: { x: page.getWidth() - config.margin, y: i },
            end: { x: page.getWidth() - config.margin, y: i + 5 },
            thickness: borderWidth,
            color: borderColor,
          });
        }
      } else if (borderStyle === 'dotted') {
        // Draw dotted border
        for (let i = 0; i < page.getWidth(); i += 5) {
          page.drawCircle({
            x: i,
            y: config.margin,
            size: 1,
            color: borderColor,
          });
          page.drawCircle({
            x: i,
            y: page.getHeight() - config.margin,
            size: 1,
            color: borderColor,
          });
        }
        for (let i = config.margin; i < page.getHeight() - config.margin; i += 5) {
          page.drawCircle({
            x: config.margin,
            y: i,
            size: 1,
            color: borderColor,
          });
          page.drawCircle({
            x: page.getWidth() - config.margin,
            y: i,
            size: 1,
            color: borderColor,
          });
        }
      } else if (borderStyle === 'solid') {
        // Draw solid border
        page.drawRectangle({
          x: config.margin,
          y: config.margin,
          width: page.getWidth() - 2 * config.margin,
          height: page.getHeight() - 2 * config.margin,
          borderWidth: borderWidth,
          borderColor: borderColor,
        });
      }
    }

    // Add watermark if enabled
    if (formData.style.watermark) {
      const watermarkFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      page.drawText(formData.style.watermarkText, {
        x: page.getWidth() / 2 - 100,
        y: page.getHeight() / 2,
        size: 60,
        font: watermarkFont,
        color: rgb(accentColor.r, accentColor.g, accentColor.b),
        opacity: formData.style.watermarkOpacity,
        rotate: { type: 'degrees', angle: -45 },
      });
    }

    // Add logo if exists
    if (formData.logo) {
      try {
        const imageData = formData.logo.split(',')[1];
        const imageBytes = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
        
        let logoImage;
        try {
          logoImage = await pdfDoc.embedPng(imageBytes);
        } catch (error) {
          try {
            logoImage = await pdfDoc.embedJpg(imageBytes);
          } catch (error) {
            console.error('Error embedding image:', error);
          }
        }

        if (logoImage) {
          const logoWidth = formData.style.layout === 'compact' ? 80 : formData.style.layout === 'detailed' ? 120 : 100;
          const logoHeight = (logoImage.height * logoWidth) / logoImage.width;
          const logoX = formData.style.headerStyle === 'right-aligned' 
            ? page.getWidth() - config.margin - logoWidth 
            : formData.style.headerStyle === 'centered'
              ? (page.getWidth() - logoWidth) / 2
              : config.margin;
          
          page.drawImage(logoImage, {
            x: logoX,
            y: y - logoHeight,
            width: logoWidth,
            height: logoHeight,
          });
          y -= logoHeight + config.lineHeight * config.sectionSpacing;
        }
      } catch (error) {
        console.error('Error processing logo:', error);
      }
    }

    // Add invoice header
    const invoiceText = `INVOICE #${formData.invoiceNumber}`;
    const invoiceWidth = boldFont.widthOfTextAtSize(invoiceText, config.titleFontSize);
    const invoiceX = formData.style.headerStyle === 'right-aligned'
      ? page.getWidth() - config.margin - invoiceWidth
      : formData.style.headerStyle === 'centered'
        ? (page.getWidth() - invoiceWidth) / 2
        : config.margin;

    page.drawText(invoiceText, {
      x: invoiceX,
      y,
      size: config.titleFontSize,
      font: boldFont,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    });
    y -= config.lineHeight * config.sectionSpacing;

    // Add dates
    const dateText = `Issue Date: ${formData.date}    Due Date: ${formData.dueDate}`;
    const dateX = formData.style.headerStyle === 'right-aligned'
      ? page.getWidth() - config.margin - boldFont.widthOfTextAtSize(dateText, config.fontSize)
      : formData.style.headerStyle === 'centered'
        ? (page.getWidth() - boldFont.widthOfTextAtSize(dateText, config.fontSize)) / 2
        : config.margin;

    page.drawText(dateText, {
      x: dateX,
      y,
      size: config.fontSize,
      font,
      color: rgb(secondaryColor.r, secondaryColor.g, secondaryColor.b),
    });
    y -= config.lineHeight * config.sectionSpacing;

    // Add business and client information
    if (formData.style.layout === 'compact') {
      // Compact layout: Single column
      page.drawText('From:', {
        x: config.margin,
        y,
        size: config.fontSize + 2,
        font: boldFont,
        color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
      });
      y -= config.lineHeight;

      const businessInfo = [
        formData.businessName,
        formData.businessAddress,
        `Email: ${formData.businessEmail}`,
        `Phone: ${formData.businessPhone}`,
      ];

      for (const line of businessInfo) {
        if (line) {
          page.drawText(line, {
            x: config.margin,
            y,
            size: config.fontSize,
            font,
            color: rgb(secondaryColor.r, secondaryColor.g, secondaryColor.b),
          });
          y -= config.lineHeight;
        }
      }
      y -= config.lineHeight * config.contentSpacing;

      page.drawText('To:', {
        x: config.margin,
        y,
        size: config.fontSize + 2,
        font: boldFont,
        color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
      });
      y -= config.lineHeight;

      const clientInfo = [
        formData.clientName,
        formData.clientAddress,
        `Email: ${formData.clientEmail}`,
        `Phone: ${formData.clientPhone}`,
      ];

      for (const line of clientInfo) {
        if (line) {
          page.drawText(line, {
            x: config.margin,
            y,
            size: config.fontSize,
            font,
            color: rgb(secondaryColor.r, secondaryColor.g, secondaryColor.b),
          });
          y -= config.lineHeight;
        }
      }
    } else {
      // Standard and Detailed layouts: Two columns
      const columnWidth = (page.getWidth() - 3 * config.margin) / 2;
      
      // Business Information (Left Column)
      page.drawText('From:', {
        x: config.margin,
        y,
        size: config.fontSize + 2,
        font: boldFont,
        color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
      });

      const businessInfo = [
        formData.businessName,
        formData.businessAddress,
        `Email: ${formData.businessEmail}`,
        `Phone: ${formData.businessPhone}`,
      ];

      let businessY = y - config.lineHeight;
      for (const line of businessInfo) {
        if (line) {
          page.drawText(line, {
            x: config.margin,
            y: businessY,
            size: config.fontSize,
            font,
            color: rgb(secondaryColor.r, secondaryColor.g, secondaryColor.b),
          });
          businessY -= config.lineHeight;
        }
      }

      // Client Information (Right Column)
      page.drawText('To:', {
        x: page.getWidth() - config.margin - columnWidth,
        y,
        size: config.fontSize + 2,
        font: boldFont,
        color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
      });

      const clientInfo = [
        formData.clientName,
        formData.clientAddress,
        `Email: ${formData.clientEmail}`,
        `Phone: ${formData.clientPhone}`,
      ];

      let clientY = y - config.lineHeight;
      for (const line of clientInfo) {
        if (line) {
          page.drawText(line, {
            x: page.getWidth() - config.margin - columnWidth,
            y: clientY,
            size: config.fontSize,
            font,
            color: rgb(secondaryColor.r, secondaryColor.g, secondaryColor.b),
          });
          clientY -= config.lineHeight;
        }
      }

      y = Math.min(businessY, clientY) - config.lineHeight * config.sectionSpacing;
    }

    y -= config.lineHeight * config.sectionSpacing;

    // Add project details
    page.drawText('Project Details:', {
      x: config.margin,
      y,
      size: config.fontSize + 2,
      font: boldFont,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    });
    y -= config.lineHeight;

    page.drawText(`Title: ${formData.projectTitle}`, {
      x: config.margin,
      y,
      size: config.fontSize,
      font,
      color: rgb(secondaryColor.r, secondaryColor.g, secondaryColor.b),
    });
    y -= config.lineHeight;

    // Add description
    if (formData.description) {
      page.drawText('Description:', {
        x: config.margin,
        y,
        size: config.fontSize,
        font: boldFont,
        color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
      });
      y -= config.lineHeight;

      const descriptionLines = formData.description.split('\n');
      for (const line of descriptionLines) {
        page.drawText(line, {
          x: config.margin,
          y,
          size: config.fontSize,
          font,
          color: rgb(secondaryColor.r, secondaryColor.g, secondaryColor.b),
        });
        y -= config.lineHeight;
      }
      y -= config.lineHeight * config.contentSpacing;
    }

    // Add payment details
    const rightAlign = page.getWidth() - config.margin - (formData.style.layout === 'detailed' ? 250 : 200);
    page.drawText('Payment Details:', {
      x: rightAlign,
      y,
      size: config.fontSize + 2,
      font: boldFont,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    });
    y -= config.lineHeight;

    const paymentDetails = [
      `Subtotal: ${formData.currency} ${formData.amount}`,
      `Tax Rate: ${formData.taxRate}%`,
      `Tax Amount: ${formData.currency} ${formData.taxAmount}`,
      `Total Amount: ${formData.currency} ${formData.totalAmount}`,
      `Payment Method: ${formData.paymentMethod}`,
    ];

    for (const line of paymentDetails) {
      page.drawText(line, {
        x: rightAlign,
        y,
        size: config.fontSize,
        font,
        color: rgb(secondaryColor.r, secondaryColor.g, secondaryColor.b),
      });
      y -= config.lineHeight;
    }
    y -= config.lineHeight * config.sectionSpacing;

    // Add terms
    page.drawText('Terms & Conditions:', {
      x: config.margin,
      y,
      size: config.fontSize + 2,
      font: boldFont,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    });
    y -= config.lineHeight;

    const termsLines = formData.terms.split('\n');
    for (const line of termsLines) {
      page.drawText(line, {
        x: config.margin,
        y,
        size: config.fontSize,
        font,
        color: rgb(secondaryColor.r, secondaryColor.g, secondaryColor.b),
      });
      y -= config.lineHeight;
    }

    // Add preview stamp only for preview
    if (isPreview) {
      const previewText = 'PREVIEW COPY - NOT FOR OFFICIAL USE';
      page.drawText(previewText, {
        x: page.getWidth() - config.margin - 200,
        y: config.margin,
        size: 10,
        font: boldFont,
        color: rgb(0.8, 0, 0),
      });
    }

    return pdfDoc;
  };

  const generatePreview = async () => {
    const pdfDoc = await PDFDocument.create();
    await generatePDFContent(pdfDoc, true);
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setShowPreview(true);
  };

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    await generatePDFContent(pdfDoc, false);
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${formData.invoiceNumber}_${formData.clientName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Create Document
            </h1>
            <p className="text-gray-500 mt-1">Design and generate professional documents</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={generatePreview}
              className="hover:bg-gray-100 transition-colors"
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={generatePDF}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
              Generate PDF
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="details"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Document Details
              </TabsTrigger>
              <TabsTrigger 
                value="items"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Items
              </TabsTrigger>
              <TabsTrigger 
                value="style"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Style
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b">
                    <CardTitle className="text-xl">Business Information</CardTitle>
                    <CardDescription>Enter your business details</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="Enter business name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessAddress">Business Address</Label>
                      <Textarea
                        id="businessAddress"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleInputChange}
                        placeholder="Enter business address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessEmail">Email</Label>
                        <Input
                          id="businessEmail"
                          name="businessEmail"
                          type="email"
                          value={formData.businessEmail}
                          onChange={handleInputChange}
                          placeholder="business@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessPhone">Phone</Label>
                        <Input
                          id="businessPhone"
                          name="businessPhone"
                          type="tel"
                          value={formData.businessPhone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Logo</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          ref={fileInputRef}
                          className="hidden"
                          id="logo-upload"
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <PhotoIcon className="w-5 h-5 mr-2" />
                          Upload Logo
                        </Button>
                        {formData.logo && (
                          <div className="relative w-16 h-16">
                            <Image
                              src={formData.logo}
                              alt="Business logo"
                              fill
                              className="object-contain"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute -top-2 -right-2"
                              onClick={removeLogo}
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b">
                    <CardTitle className="text-xl">Client Information</CardTitle>
                    <CardDescription>Enter client details</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientAddress">Client Address</Label>
                      <Textarea
                        id="clientAddress"
                        name="clientAddress"
                        value={formData.clientAddress}
                        onChange={handleInputChange}
                        placeholder="Enter client address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientEmail">Email</Label>
                        <Input
                          id="clientEmail"
                          name="clientEmail"
                          type="email"
                          value={formData.clientEmail}
                          onChange={handleInputChange}
                          placeholder="client@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientPhone">Phone</Label>
                        <Input
                          id="clientPhone"
                          name="clientPhone"
                          type="tel"
                          value={formData.clientPhone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 border-none shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b">
                    <CardTitle className="text-xl">Document Details</CardTitle>
                    <CardDescription>Enter document information</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="invoiceNumber">Document Number</Label>
                        <Input
                          id="invoiceNumber"
                          name="invoiceNumber"
                          value={formData.invoiceNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          name="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={formData.currency}
                          onValueChange={(value) => handleInputChange({ target: { name: 'currency', value } } as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="terms">Terms & Conditions</Label>
                      <Textarea
                        id="terms"
                        name="terms"
                        value={formData.terms}
                        onChange={handleInputChange}
                        placeholder="Enter terms and conditions"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="items" className="space-y-6">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">Items</CardTitle>
                      <CardDescription>Add items to your document</CardDescription>
                    </div>
                    <Button 
                      onClick={addItem}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-200"
                    >
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <Card 
                        key={item.id}
                        className="border-none shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-5">
                              <Label>Description</Label>
                              <Input
                                value={item.description}
                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                placeholder="Item description"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Quantity</Label>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                min="1"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Rate</Label>
                              <Input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Amount</Label>
                              <Input
                                value={item.amount}
                                readOnly
                                className="bg-gray-50"
                              />
                            </div>
                            <div className="col-span-1 flex items-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <XMarkIcon className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <Label className="text-gray-600">Subtotal</Label>
                        <Input
                          value={formData.amount}
                          readOnly
                          className="bg-white border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600">Tax Rate (%)</Label>
                        <Input
                          type="number"
                          name="taxRate"
                          value={formData.taxRate}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          className="bg-white border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600">Tax Amount</Label>
                        <Input
                          value={formData.taxAmount}
                          readOnly
                          className="bg-white border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600">Total</Label>
                        <Input
                          value={formData.totalAmount}
                          readOnly
                          className="bg-white border-gray-200 font-semibold text-lg"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="style" className="space-y-6">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b">
                  <CardTitle className="text-xl">Document Style</CardTitle>
                  <CardDescription>Customize the appearance of your document</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-gray-600">Font Family</Label>
                        <Select
                          value={formData.style.fontFamily}
                          onValueChange={(value) => handleInputChange({ target: { name: 'style.fontFamily', value } })}
                        >
                          <SelectTrigger className="bg-white border-gray-200">
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="helvetica">Helvetica</SelectItem>
                            <SelectItem value="times">Times New Roman</SelectItem>
                            <SelectItem value="courier">Courier</SelectItem>
                            <SelectItem value="arial">Arial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-600">Font Size</Label>
                        <Select
                          value={formData.style.fontSize}
                          onValueChange={(value) => handleInputChange({ target: { name: 'style.fontSize', value } })}
                        >
                          <SelectTrigger className="bg-white border-gray-200">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-gray-600">Layout</Label>
                        <Select
                          value={formData.style.layout}
                          onValueChange={(value) => handleInputChange({ target: { name: 'style.layout', value } })}
                        >
                          <SelectTrigger className="bg-white border-gray-200">
                            <SelectValue placeholder="Select layout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="compact">Compact</SelectItem>
                            <SelectItem value="detailed">Detailed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-600">Header Style</Label>
                        <Select
                          value={formData.style.headerStyle}
                          onValueChange={(value) => handleInputChange({ target: { name: 'style.headerStyle', value } })}
                        >
                          <SelectTrigger className="bg-white border-gray-200">
                            <SelectValue placeholder="Select header style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="centered">Centered</SelectItem>
                            <SelectItem value="left-aligned">Left Aligned</SelectItem>
                            <SelectItem value="right-aligned">Right Aligned</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-600">Border Style</Label>
                        <Select
                          value={formData.style.borderStyle}
                          onValueChange={(value) => handleInputChange({ target: { name: 'style.borderStyle', value } })}
                        >
                          <SelectTrigger className="bg-white border-gray-200">
                            <SelectValue placeholder="Select border style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="solid">Solid</SelectItem>
                            <SelectItem value="dashed">Dashed</SelectItem>
                            <SelectItem value="dotted">Dotted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Document Preview</DialogTitle>
              <DialogDescription>
                Preview your document before generating the PDF
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {previewUrl ? (
                <div className="relative">
                  <iframe
                    src={previewUrl}
                    className="w-full h-[600px] border rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-white opacity-10"></div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading preview...</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
