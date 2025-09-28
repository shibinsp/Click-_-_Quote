// Quotation service for handling quote data
export const getQuotationsByPostcode = async (postcode) => {
  try {
    // For TW14 0BJ postcode, return quotations based on the four sets
    if (postcode && postcode.toUpperCase().includes('TW14')) {
      const quotations = [
        {
          qid: 2001, // Quote ID for sorting
          quoteId: "TW14-001",
          postcode: "TW14 0BJ",
          customerName: "Smart Connections",
          projectType: "New Connection",
          connectionType: "Three Phase",
          loadRequirement: "400 kVA",
          estimatedCost: 18500,
          currency: "GBP",
          validUntil: "2025-12-31",
          quoteDate: "2025-09-28",
          description: "New three-phase connection for Smart Connections commercial premises",
          siteAddress: "102 Field Road, Feltham, TW14 0BJ",
          sitePlan: "Commercial premises with flexible connection requirements",
          loadDemand: "400 kVA peak demand (2 x 200 kVA installations)",
          validityPeriod: "Valid until 31st December 2025",
          connectionDate: "2025-11-21",
          breakdown: {
            connectionFee: 4500,
            cableInstallation: 6500,
            substationWork: 4000,
            permitsAndLicenses: 1200,
            testingAndCommissioning: 1800,
            flexibleConnectionPremium: 500
          },
          terms: {
            paymentTerms: "50% upfront, 50% on completion",
            warranty: "2 years on all equipment",
            completionTime: "8-12 weeks from start date"
          },
          contact: {
            engineer: "********",
            email: "*******@ukpowernetworks.co.uk",
            phone: "##########"
          }
        },
        {
          qid: 2002, // Quote ID for sorting
          quoteId: "TW14-002",
          postcode: "TW14 0BJ",
          customerName: "Connection2 Energy",
          projectType: "New Connection",
          connectionType: "Three Phase",
          loadRequirement: "400 kVA",
          estimatedCost: 18200,
          currency: "GBP",
          validUntil: "2025-12-31",
          quoteDate: "2025-09-25",
          description: "New three-phase connection for Connection2 Energy commercial premises",
          siteAddress: "112 Field Road, Feltham, TW14 0BJ",
          sitePlan: "Commercial premises with flexible connection requirements",
          loadDemand: "400 kVA peak demand (2 x 200 kVA installations)",
          validityPeriod: "Valid until 31st December 2025",
          connectionDate: "2025-12-01",
          breakdown: {
            connectionFee: 4200,
            cableInstallation: 6200,
            substationWork: 3800,
            permitsAndLicenses: 1100,
            testingAndCommissioning: 1700,
            flexibleConnectionPremium: 500
          },
          terms: {
            paymentTerms: "50% upfront, 50% on completion",
            warranty: "2 years on all equipment",
            completionTime: "8-12 weeks from start date"
          },
          contact: {
            engineer: "********",
            email: "*******@ukpowernetworks.co.uk",
            phone: "##########"
          }
        },
        {
          qid: 2003, // Quote ID for sorting
          quoteId: "TW14-003",
          postcode: "TW14 0BJ",
          customerName: "Royal Energy",
          projectType: "New Connection",
          connectionType: "Three Phase",
          loadRequirement: "400 kVA",
          estimatedCost: 17900,
          currency: "GBP",
          validUntil: "2025-12-31",
          quoteDate: "2025-09-22",
          description: "New three-phase connection for Royal Energy commercial premises",
          siteAddress: "112 Field Road, Feltham, TW14 0BJ",
          sitePlan: "Commercial premises with flexible connection requirements",
          loadDemand: "400 kVA peak demand (2 x 200 kVA installations)",
          validityPeriod: "Valid until 31st December 2025",
          connectionDate: "2025-12-01",
          breakdown: {
            connectionFee: 4000,
            cableInstallation: 6000,
            substationWork: 3600,
            permitsAndLicenses: 1000,
            testingAndCommissioning: 1600,
            flexibleConnectionPremium: 500
          },
          terms: {
            paymentTerms: "50% upfront, 50% on completion",
            warranty: "2 years on all equipment",
            completionTime: "8-12 weeks from start date"
          },
          contact: {
            engineer: "********",
            email: "*******@ukpowernetworks.co.uk",
            phone: "##########"
          }
        },
        {
          qid: 2004, // Quote ID for sorting
          quoteId: "TW14-004",
          postcode: "TW14 0BJ",
          customerName: "National Energy Provider",
          projectType: "New Connection",
          connectionType: "Three Phase",
          loadRequirement: "400 kVA",
          estimatedCost: 17600,
          currency: "GBP",
          validUntil: "2025-12-31",
          quoteDate: "2025-09-20",
          description: "New three-phase connection for National Energy Provider commercial premises",
          siteAddress: "110 Field Road, Feltham, TW14 0BJ",
          sitePlan: "Commercial premises with flexible connection requirements",
          loadDemand: "400 kVA peak demand (2 x 200 kVA installations)",
          validityPeriod: "Valid until 31st December 2025",
          connectionDate: "2025-12-01",
          breakdown: {
            connectionFee: 3800,
            cableInstallation: 5800,
            substationWork: 3400,
            permitsAndLicenses: 900,
            testingAndCommissioning: 1500,
            flexibleConnectionPremium: 500
          },
          terms: {
            paymentTerms: "50% upfront, 50% on completion",
            warranty: "2 years on all equipment",
            completionTime: "8-12 weeks from start date"
          },
          contact: {
            engineer: "********",
            email: "*******@ukpowernetworks.co.uk",
            phone: "##########"
          }
        }
      ];
      
      return quotations;
    }
    
    // For TW3 postcode, return sample quotations
    if (postcode && postcode.toUpperCase().startsWith('TW3')) {
      const quotations = [
        {
          qid: 1001, // Quote ID for sorting
          quoteId: "TW3-001",
          postcode: "TW3",
          customerName: "Sample Customer Ltd",
          projectType: "New Connection",
          connectionType: "Three Phase",
          loadRequirement: "150 kVA",
          estimatedCost: 12500,
          currency: "GBP",
          validUntil: "2025-12-31",
          quoteDate: "2025-09-28",
          description: "New three-phase connection for commercial premises",
          siteAddress: "123 Main Street, TW3 1AB",
          sitePlan: "Commercial premises with 50m x 30m boundary",
          loadDemand: "150 kVA peak demand",
          validityPeriod: "Valid until 31st December 2025",
          breakdown: {
            connectionFee: 3500,
            cableInstallation: 4500,
            substationWork: 2500,
            permitsAndLicenses: 800,
            testingAndCommissioning: 1200
          },
          terms: {
            paymentTerms: "50% upfront, 50% on completion",
            warranty: "2 years on all equipment",
            completionTime: "8-12 weeks from start date"
          },
          contact: {
            engineer: "********",
            email: "*******@ukpowernetworks.co.uk",
            phone: "##########"
          }
        },
        {
          qid: 1002, // Quote ID for sorting
          quoteId: "TW3-002",
          postcode: "TW3",
          customerName: "Residential Development",
          projectType: "Upgrade",
          connectionType: "Single Phase",
          loadRequirement: "25 kVA",
          estimatedCost: 3200,
          currency: "GBP",
          validUntil: "2025-12-15",
          quoteDate: "2025-09-25",
          description: "Upgrade existing single-phase connection for residential development",
          siteAddress: "456 Oak Avenue, TW3 2CD",
          sitePlan: "Residential development with 20m x 15m boundary",
          loadDemand: "25 kVA peak demand",
          validityPeriod: "Valid until 15th December 2025",
          breakdown: {
            upgradeFee: 1200,
            cableReplacement: 800,
            meterInstallation: 400,
            permitsAndLicenses: 200,
            testingAndCommissioning: 600
          },
          terms: {
            paymentTerms: "Full payment on completion",
            warranty: "1 year on all equipment",
            completionTime: "4-6 weeks from start date"
          },
          contact: {
            engineer: "********",
            email: "*******@ukpowernetworks.co.uk",
            phone: "##########"
          }
        },
        {
          qid: 1003, // Quote ID for sorting
          quoteId: "TW3-003",
          postcode: "TW3",
          customerName: "Industrial Complex",
          projectType: "New Connection",
          connectionType: "Three Phase",
          loadRequirement: "500 kVA",
          estimatedCost: 45000,
          currency: "GBP",
          validUntil: "2026-01-15",
          quoteDate: "2025-09-20",
          description: "High voltage connection for industrial manufacturing facility",
          siteAddress: "789 Industrial Park, TW3 3EF",
          sitePlan: "Industrial complex with 100m x 80m boundary",
          loadDemand: "500 kVA peak demand",
          validityPeriod: "Valid until 15th January 2026",
          breakdown: {
            connectionFee: 15000,
            cableInstallation: 18000,
            substationWork: 8000,
            permitsAndLicenses: 2000,
            testingAndCommissioning: 2000
          },
          terms: {
            paymentTerms: "30% upfront, 40% at 50% completion, 30% on completion",
            warranty: "3 years on all equipment",
            completionTime: "16-20 weeks from start date"
          },
          contact: {
            engineer: "********",
            email: "*******@ukpowernetworks.co.uk",
            phone: "##########"
          }
        }
      ];
      
      return quotations;
    }
    
    // For other postcodes, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return [];
  }
};

// Get the quote with highest validity period
export const getHighestValidityQuote = (quotations) => {
  if (!quotations || quotations.length === 0) return null;
  
  // Sort by validity period (validUntil date) descending, then by QID descending
  const sortedQuotes = quotations.sort((a, b) => {
    const dateA = new Date(a.validUntil);
    const dateB = new Date(b.validUntil);
    
    // First sort by validity period (highest first)
    if (dateA.getTime() !== dateB.getTime()) {
      return dateB.getTime() - dateA.getTime();
    }
    
    // If validity periods are the same, sort by QID (highest first)
    return b.qid - a.qid;
  });
  
  return sortedQuotes[0];
};

export const cloneQuotation = (originalQuote) => {
  const clonedQuote = {
    ...originalQuote,
    quoteId: `${originalQuote.quoteId}-CLONE-${Date.now()}`,
    quoteDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
    customerName: "Cloned Quote - " + originalQuote.customerName,
    description: `Cloned from ${originalQuote.quoteId}: ${originalQuote.description}`
  };
  
  return clonedQuote;
};

export const formatCurrency = (amount, currency = 'GBP') => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency
  }).format(amount);
};
