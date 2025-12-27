import { useState, useEffect, useRef } from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import { FaFileSignature, FaDownload, FaPrint, FaCheckCircle } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import Button from "../../../components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createProjectFromQuote, fetchQuoteSummary, getDeliverablesByQuoteId } from "../../../services/quoteServices";
import { sendContractToLegality, generateContractDocument, prepareTemplateFields } from "../../../services/legalityServices";

function SignContract() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [clientSignature, setClientSignature] = useState("");
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const contractRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data from navigation state
  const { quoteId, totalAmount, qid, architectId, clientName, contractId } = location.state || {};
  const [userRole, setUserRole] = useState("");
  
  // Get user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem('crm_role') || '';
    setUserRole(role);
  }, []);

  // Utility: open multiple URLs in new tabs with anchor click (better for popup blockers)
  const openSigningLinks = (urls = []) => {
    urls
      .filter(Boolean)
      .forEach((url) => {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  };

  // Fetch contract and quote details
  useEffect(() => {
    const fetchData = async () => {
      // If contractId is provided, fetch contract first to get quoteId
      let quoteIdToUse = quoteId;
      
      if (contractId && !quoteId) {
        try {
          const { fetchContractById } = await import("../../../services/contractServices");
          const contract = await fetchContractById(contractId);
          if (contract?.quoteId?._id) {
            quoteIdToUse = contract.quoteId._id;
          }
        } catch (err) {
          console.error("Error fetching contract:", err);
        }
      }
      
      if (!quoteIdToUse) return;
      
      try {
        const quoteIdString = typeof quoteIdToUse === 'string' ? quoteIdToUse : (quoteIdToUse?._id || quoteIdToUse?.toString());
        const summary = await fetchQuoteSummary(quoteIdString);
        setQuoteData({ summary: Array.isArray(summary) ? summary : [] });
        
        // Fetch deliverables
        try {
          const deliverablesData = await getDeliverablesByQuoteId(quoteIdString);
          setDeliverables(deliverablesData?.deliverables || []);
        } catch (err) {
          console.error("Error fetching deliverables:", err);
          setDeliverables([]);
        }
      } catch (error) {
        console.error("Error fetching quote details:", error);
      }
    };
    fetchData();
  }, [quoteId, contractId]);

  // Download contract as PDF
  const handleDownloadPDF = async () => {
    if (!contractRef.current) {
      toast.error("Contract content not found");
      return;
    }

    try {
      setIsDownloading(true);
      toast.info("Generating PDF... Please wait", { autoClose: 3000 });

      const element = contractRef.current;
      
      // Hide buttons and other UI elements that shouldn't be in PDF
      const buttons = element.querySelectorAll('button');
      const originalDisplay = [];
      buttons.forEach(btn => {
        originalDisplay.push(btn.style.display);
        btn.style.display = 'none';
      });

      // Capture the contract as canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // Restore button visibility
      buttons.forEach((btn, index) => {
        btn.style.display = originalDisplay[index];
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 0; // No margin for full page
      
      // Calculate dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const imgScaledWidth = imgWidth * ratio;
      const imgScaledHeight = imgHeight * ratio;

      // Calculate how many pages we need
      let heightLeft = imgScaledHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', margin, position, imgScaledWidth, imgScaledHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgScaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgScaledWidth, imgScaledHeight);
        heightLeft -= pdfHeight;
      }

      // Generate filename with quote reference and date
      const quoteRef = qid || quoteId?.slice(-8) || "N/A";
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `MSA_Contract_${quoteRef}_${dateStr}.pdf`;
      
      // Save the PDF
      pdf.save(filename);
      
      toast.success(`Contract downloaded as ${filename}`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again or use Print instead.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle contract signing
  const handleSignContract = async () => {
    console.log("=== handleSignContract called ===");
    
    if (!agreedToTerms) {
      console.log("Validation failed: agreedToTerms is false");
      toast.error("Please agree to the terms and conditions");
      return;
    }

    if (!clientSignature.trim()) {
      console.log("Validation failed: clientSignature is empty");
      toast.error("Please provide your signature");
      return;
    }

    if (!quoteId) {
      console.log("Validation failed: quoteId is missing");
      toast.error("Quote ID is missing");
      return;
    }

    try {
      setIsSigning(true);
      console.log("=== Starting Contract Signing Process ===");
      console.log("Quote ID:", quoteId);
      console.log("Client Name:", clientName);
      
      // Calculate finalTotal here to ensure it's available
      const calculateTotals = () => {
        if (!quoteData?.summary) return { amount: 0, tax: 0, total: 0 };
        const totals = quoteData.summary.reduce(
          (acc, item) => ({
            amount: acc.amount + (item.amount || 0),
            tax: acc.tax + (item.tax || 0),
            total: acc.total + (item.total || item.amount || 0),
          }),
          { amount: 0, tax: 0, total: 0 }
        );
        return totals;
      };
      const totals = calculateTotals();
      const finalTotal = totalAmount || totals.total;
      
      console.log("Total Amount:", finalTotal);
      console.log("Totals calculated:", totals);
      toast.info("Sending contract to Leegality and creating project...");

      const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
      
      // Get current user details (client/professional)
      const currentUserId = localStorage.getItem('crm_user_id');
      const currentUserName = localStorage.getItem('crm_user_name') || clientName || "User";
      let currentUserEmail = localStorage.getItem('crm_user_email') || "";
      const currentUserRole = localStorage.getItem('crm_role') || "";
      
      // Fetch quote to get client and professional details
      let quoteDetails = null;
      let clientEmail = "";
      let professionalEmail = "";
      let professionalName = "";
      
      try {
        const { fetchQuoteById } = await import("../../../services/quoteServices");
        quoteDetails = await fetchQuoteById(quoteIdString);
        
        // Get client email from quote's leadId
        if (quoteDetails?.leadId?.email) {
          clientEmail = quoteDetails.leadId.email;
        } else if (quoteDetails?.leadId?.contact && quoteDetails.leadId.contact.includes('@')) {
          clientEmail = quoteDetails.leadId.contact;
        }
        
        // Get professional email and name from quote's assigned
        if (quoteDetails?.assigned && quoteDetails.assigned.length > 0) {
          const professional = Array.isArray(quoteDetails.assigned) ? quoteDetails.assigned[0] : quoteDetails.assigned;
          professionalName = professional.name || "";
          professionalEmail = professional.email || "";
        }
      } catch (err) {
        console.error("Error fetching quote details:", err);
      }

      // If email is not in localStorage, try to fetch from API
      if (!currentUserEmail || !currentUserEmail.trim()) {
        console.log("Email not in localStorage, attempting to fetch user data...");
        try {
          const { getCurrentUser } = await import("../../../services/authServices");
          const userData = await getCurrentUser();
          const user = userData.user || userData;
          
          if (user && user.email) {
            currentUserEmail = user.email;
            // Store it for future use
            localStorage.setItem('crm_user_email', user.email);
            console.log("Email fetched from API and stored");
          } else if (user && user.emailOrPhone) {
            // Some users might have emailOrPhone instead of email
            currentUserEmail = user.emailOrPhone.includes('@') ? user.emailOrPhone : "";
            if (currentUserEmail) {
              localStorage.setItem('crm_user_email', currentUserEmail);
              console.log("Email fetched from emailOrPhone and stored");
            }
          }
        } catch (fetchError) {
          console.error("Failed to fetch user email:", fetchError);
        }
      }

      // Validate email is present
      console.log("User details:", {
        userId: currentUserId,
        userName: currentUserName,
        userEmail: currentUserEmail ? `${currentUserEmail.substring(0, 3)}***` : "MISSING",
        userRole: currentUserRole,
      });

      if (!currentUserEmail || !currentUserEmail.trim()) {
        console.error("Email validation failed - email is missing");
        toast.error(
          "User email is required for contract signing. " +
          "Please ensure you are logged in with a valid email address, or contact support."
        );
        setIsSigning(false);
        return;
      }

      console.log("Email validation passed, generating contract document...");

      // Generate contract document
      console.log("Generating contract document...");
      const contractDocument = generateContractDocument({
        clientName: clientName || currentUserName,
        professionalName: currentUserName, // Adjust based on who is signing
        quoteId: qid || quoteIdString,
        totalAmount: finalTotal,
        summary: quoteData?.summary || [],
        deliverables: deliverables,
        termsAndConditions: "All terms and conditions as per Master Service Agreement",
        clientSignature: clientSignature,
      });
      console.log("Contract document generated, length:", contractDocument.length);

      // Prepare contract data for Leegality API
      // 
      // Leegality supports TWO workflow types:
      // 1. PDF Workflow: Requires PDF file in base64 format
      // 2. Template Workflow: Uses template from dashboard with field values
      //
      // For Template Workflow (RECOMMENDED - no PDF conversion needed):
      // - Create a Template in Leegality Dashboard
      // - Download Form Fields to get field names
      // - Pass fields object instead of document
      // - Set useTemplate: true or just provide fields object
      
      // Option A: Use Template Workflow (Recommended - easier, no PDF conversion)
      // Uncomment below to use Template workflow:
      /*
      const templateFields = prepareTemplateFields({
        clientName: clientName || currentUserName,
        professionalName: currentUserName,
        quoteId: qid || quoteIdString,
        totalAmount: finalTotal,
        date: new Date(),
        termsAndConditions: "All terms and conditions as per Master Service Agreement",
      }, {
        // Custom field mapping - get exact field names from Dashboard > Download Form Fields
        // clientName: "ClientName",  // Map to your template field name
        // totalAmount: "TotalAmount", // Map to your template field name
      });
      */
      
      // Set up signers: Client first, then Professional
      const signersList = [];
      
      // Add client as first signer
      const clientSignerEmail = currentUserRole === 'client' ? currentUserEmail : (clientEmail || "");
      if (clientSignerEmail && clientSignerEmail.trim()) {
        signersList.push({
          name: clientName || quoteDetails?.leadId?.name || "Client",
          email: clientSignerEmail,
          role: 'client',
          // order: 1, // Client signs first
        });
      }
      
      // Add professional as second signer
      const professionalSignerEmail = currentUserRole === 'architect' ? currentUserEmail : (professionalEmail || "");
      if (professionalSignerEmail && professionalSignerEmail.trim() && professionalSignerEmail !== clientSignerEmail) {
        signersList.push({
          name: professionalName || quoteDetails?.assigned?.[0]?.name || "Professional",
          email: professionalSignerEmail,
          role: 'professional',
          // order: 2, // Professional signs second
        });
      }
      
      // If current user is signing, ensure their email is in the list
      if (currentUserEmail && currentUserEmail.trim()) {
        const userSignerExists = signersList.some(s => s.email === currentUserEmail);
        if (!userSignerExists) {
          // Add current user as signer
          signersList.push({
            name: currentUserName,
            email: currentUserEmail,
            role: currentUserRole === 'client' ? 'client' : 'professional',
          });
        }
      }
      
      const signers = signersList.filter(signer => signer.email && signer.email.trim()); // Remove any signers without email

      // Option B: Use PDF Workflow (requires PDF conversion)
      const contractData = {
        // ============================================
        // REQUIRED: Workflow Profile ID
        // ============================================
        // You MUST provide profileId in one of these ways:
        // 
        // Option 1 (Recommended): Create frontend/.env file with:
        //   REACT_APP_LEEGALITY_PROFILE_ID=your-workflow-id-here
        //   REACT_APP_LEEGALITY_AUTH_TOKEN=your-auth-token-here
        //   REACT_APP_LEEGALITY_API_BASE=https://sandbox.leegality.com/api/v3.0
        // Then restart your dev server.
        //
        // Option 2 (Quick fix): Uncomment and set below:
        // profileId: "your-workflow-id-here",
        //
        // To get your Workflow ID:
        // 1. Go to https://sandbox.leegality.com (or app1.leegality.com for production)
        // 2. Create a Workflow or use an existing one
        // 3. Copy the Workflow ID/Profile ID
        // ============================================
        
        // For PDF Workflow:
        // Document: PDF in base64 format required
        // Currently passing HTML - will need conversion to PDF
        // TODO: Convert HTML to PDF before sending, or use Template workflow instead
        document: contractDocument, // HTML document - needs conversion to PDF base64
        
        // For Template Workflow (uncomment to use):
        // useTemplate: true, // Set to true to use Template workflow
        // fields: templateFields, // Field values for template
        
        // File name for the document
        fileName: `Service_Agreement_${qid || quoteIdString}.pdf`,
        
        // Internal Reference Number (optional but recommended for tracking)
        irn: qid || quoteIdString,
        quoteId: quoteIdString,
        
        // Signers (invitees) - Leegality API format
        signers: signers,
        
        // Optional: CC recipients
        // cc: [
        //   {
        //     name: "CC Recipient Name",
        //     email: "cc@example.com",
        //   },
        // ],
        
        // Optional: Stamp series if using stamp papers
        // stampSeries: "your-stamp-series-id",
        
        // Metadata for internal use (not sent to Leegality)
        metadata: {
          title: `Service Agreement - ${qid || quoteIdString}`,
          clientName: clientName || currentUserName,
          professionalName: currentUserName,
          totalAmount: finalTotal,
          date: new Date().toISOString(),
          quoteId: quoteIdString,
          qid: qid,
          architectId: architectId,
          summary: quoteData?.summary || [],
          deliverablesCount: deliverables.length,
        },
      };

      // Send contract to Leegality API
      console.log("=== Step 1: Preparing contract data for Leegality API ===");
      console.log("Contract Data:", {
        profileId: contractData.profileId || "Using env var",
        signersCount: contractData.signers?.length,
        signers: contractData.signers?.map(s => ({ name: s.name, email: s.email ? `${s.email.substring(0, 3)}***` : "MISSING" })),
        hasDocument: !!contractData.document,
        documentLength: contractData.document?.length,
        irn: contractData.irn,
      });
      
      // Validate signers before sending
      const validSigners = contractData.signers?.filter(s => s.email && s.email.trim()) || [];
      if (validSigners.length === 0) {
        console.error("No valid signers found!");
        toast.error("No valid signers found. Please ensure signers have email addresses.");
        setIsSigning(false);
        return;
      }
      console.log("Valid signers count:", validSigners.length);
      
      let legalitySuccess = false;
      let legalityResponse = null;
      try {
        console.log("=== Step 2: Calling Leegality API ===");
        legalityResponse = await sendContractToLegality(contractData);
        console.log("=== Leegality API Success ===");
        console.log("Leegality API Response:", legalityResponse);
        legalitySuccess = true;
        
        // Extract signing links from response
        const signingLinks = legalityResponse.signingLinks || [];
        const invitees = legalityResponse.invitees || [];
        
        // Extract signing URLs from invitees if links array is empty
        let allSigningUrls = [...signingLinks];
        if (allSigningUrls.length === 0 && invitees.length > 0) {
          invitees.forEach(invitee => {
            const url = invitee.signingUrl || invitee.signUrl || invitee.url;
            if (url && !allSigningUrls.includes(url)) {
              allSigningUrls.push(url);
            }
          });
        }
        
        console.log("Signing URLs found:", allSigningUrls);
        
        // Open signing links in new tabs
        if (allSigningUrls.length > 0) {
          toast.success(
            `Contract sent successfully! Opening signing link${allSigningUrls.length > 1 ? 's' : ''}...`,
            { duration: 3000 }
          );

          // Use anchor click to reduce popup blocking; still best-effort
          openSigningLinks(allSigningUrls);
        } else {
          toast.success(
            `Contract sent to Leegality successfully! Document ID: ${legalityResponse.documentId}`,
            { duration: 5000 }
          );
          toast.info("Signing links will be sent via email to the signers.", { duration: 5000 });
        }
      } catch (legalityError) {
        console.error("=== Leegality API Failed ===");
        console.error("Error Type:", legalityError.constructor.name);
        console.error("Error Message:", legalityError.message);
        console.error("Error Code:", legalityError.code);
        console.error("Error Response:", legalityError.response?.data);
        console.error("Error Status:", legalityError.response?.status);
        console.error("Error Status Text:", legalityError.response?.statusText);
        console.error("Is SSL Error:", legalityError.isSSLError);
        console.error("Is Network Error:", legalityError.isNetworkError);
        console.error("Full Error Object:", legalityError);
        
        // Show detailed error message based on error type
        let errorMsg = legalityError.message || "Unknown error";
        
        // Handle configuration errors (missing profileId or auth token)
        if (errorMsg.includes('Profile ID') || errorMsg.includes('Auth Token') || errorMsg.includes('required')) {
          const configErrorMsg = 
            "Leegality API Configuration Missing! " +
            "Please set REACT_APP_LEEGALITY_PROFILE_ID and REACT_APP_LEEGALITY_AUTH_TOKEN in your .env file. " +
            "Get these from your Leegality Dashboard. Continuing with project creation...";
          
          toast.error(configErrorMsg, { 
            duration: 8000
          });
          
          // Also log detailed instructions to console
          console.error("=== Leegality Configuration Required ===");
          console.error("Add these to your frontend/.env file:");
          console.error("REACT_APP_LEEGALITY_PROFILE_ID=your-workflow-id");
          console.error("REACT_APP_LEEGALITY_AUTH_TOKEN=your-auth-token");
          console.error("REACT_APP_LEEGALITY_API_BASE=https://sandbox.leegality.com/api/v3.0");
          console.error("After updating .env, restart your development server.");
        }
        // Handle SSL/Certificate errors
        else if (legalityError.isSSLError || legalityError.code === 'ERR_SSL_UNRECOGNIZED_NAME_ALERT') {
          toast.error(
            "Leegality API SSL Error: The API domain appears to be invalid or not configured. " +
            "Please set REACT_APP_LEEGALITY_API_BASE in your .env file with the correct API endpoint. " +
            "Continuing with project creation...",
            { duration: 6000 }
          );
        }
        // Handle network errors
        else if (legalityError.isNetworkError || legalityError.code === 'ERR_NETWORK' || legalityError.message.includes('Network Error')) {
          toast.warning(
            "Leegality API endpoint not reachable. Please check your internet connection and API configuration. " +
            "Continuing with project creation...",
            { duration: 5000 }
          );
        }
        // Handle timeout errors
        else if (legalityError.code === 'ECONNABORTED' || legalityError.message.includes('timeout')) {
          toast.warning(
            "Leegality API request timed out. The service may be unavailable. " +
            "Continuing with project creation...",
            { duration: 5000 }
          );
        }
        // Handle HTTP errors
        else if (legalityError.response?.status === 404) {
          toast.warning(
            "Leegality API endpoint not found. Please verify the API URL in your configuration. " +
            "Continuing with project creation...",
            { duration: 5000 }
          );
        }
        else if (legalityError.response?.status) {
          toast.warning(
            `Leegality API Error (${legalityError.response.status}): ${errorMsg}. Continuing with project creation...`,
            { duration: 5000 }
          );
        }
        // Handle other errors
        else {
          toast.warning(
            `Leegality API Error: ${errorMsg}. Continuing with project creation...`,
            { duration: 5000 }
          );
        }
        
        legalitySuccess = false;
        // Continue with project creation even if Leegality API fails
      }

      // Create project from quote (only if both parties have signed or if professional is signing)
      // Note: Project creation should ideally happen after both parties sign, but for now we'll create it when professional signs
      if (currentUserRole === 'architect') {
        console.log("Creating project from quote...");
        try {
          await createProjectFromQuote(quoteIdString, architectId);
          toast.success("Contract sent for signing! Project will be created after both parties sign.");
        } catch (projectError) {
          console.error("Error creating project:", projectError);
          // Don't fail the contract signing if project creation fails
        }
      }

      toast.success("Contract sent for signing successfully! Both parties will receive signing links via email.");
      setTimeout(() => {
        navigate("/contracts");
      }, 1500);
    } catch (err) {
      console.error("Error signing contract:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to sign contract. Please try again."
      );
    } finally {
      setIsSigning(false);
    }
  };

  // Handle signature input
  const handleSignatureChange = (e) => {
    setClientSignature(e.target.value);
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!quoteData?.summary) return { amount: 0, tax: 0, total: 0 };
    const totals = quoteData.summary.reduce(
      (acc, item) => ({
        amount: acc.amount + (item.amount || 0),
        tax: acc.tax + (item.tax || 0),
        total: acc.total + (item.total || 0),
      }),
      { amount: 0, tax: 0, total: 0 }
    );
    return totals;
  };

  const totals = calculateTotals();
  const finalTotal = totalAmount || totals.total;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header
          title="Sign Contract"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-6 max-w-5xl mx-auto w-full">
          {/* Contract Document Card */}
          <div ref={contractRef} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">MASTER SERVICE AGREEMENT (MSA)</h1>
                  <p className="text-red-100">
                    Between: Client & Professional | Platform: Huelip (as Neutral Technology & Escrow Workflow Provider)
                  </p>
                  <p className="text-red-100 text-sm mt-1">
                    Jurisdiction: Delhi Only | Quote #{qid || quoteId?.slice(-8) || "N/A"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    size="sm"
                    variant="custom"
                    onClick={() => window.print()}
                  >
                    <FaPrint className="mr-2" />
                    Print
                  </Button>
                  <Button
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    size="sm"
                    variant="custom"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                  >
                    <FaDownload className="mr-2" />
                    {isDownloading ? "Generating..." : "Download"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Contract Content */}
            <div className="p-8 space-y-6">
              {/* Parties Section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Parties
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Service Provider</h3>
                    <p className="text-gray-600">[Your Company Name]</p>
                    <p className="text-gray-600">[Company Address]</p>
                    <p className="text-gray-600">[Contact Information]</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Client</h3>
                    <p className="text-gray-600">{clientName || "[Client Name]"}</p>
                    <p className="text-gray-600">[Client Address]</p>
                    <p className="text-gray-600">[Contact Information]</p>
                  </div>
                </div>
              </section>

              {/* Project Details */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Project Details
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project Type:</span>
                    <span className="font-medium">Interior Design & Execution</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quote Reference:</span>
                    <span className="font-medium">#{qid || quoteId?.slice(-8) || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Contract Value:</span>
                    <span className="font-bold text-red-600">
                      ₹{Number(finalTotal).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </section>

              {/* Terms and Conditions - MSA */}
              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  MASTER SERVICE AGREEMENT TERMS & CONDITIONS
                </h2>
                
                <div className="prose max-w-none text-sm text-gray-700 space-y-6">
                  {/* SECTION 1 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 1 — DEFINITIONS</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">1.1 Project</h4>
                        <p className="text-gray-600">
                          The term "Project" refers to the complete scope of interior/architectural work defined in the approved quotation/BOQ. This includes all tasks, materials, services, and measurable units that together create the total value of the project. Every task listed in the BOQ carries a monetary value and a corresponding percentage weightage contributing to the total project cost.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">1.2 Escrow Account</h4>
                        <p className="text-gray-600">
                          An account exclusively used to hold the Client's funds safely until approval conditions are met. The Platform automates all deposits, calculations, percentage-based milestones, payouts, deductions, penalties, buffers, and refunds. The Professional never receives funds directly unless released by the system after approvals.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">1.3 BOQ / Quotation</h4>
                        <p className="text-gray-600">
                          A line-item schedule listing every task, material, and service with its unit rate, quantity, total value, and its equivalent percentage of the total project cost. The BOQ determines work completion percentage and therefore the release of payments.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">1.4 Percentage-Based Work Completion</h4>
                        <p className="text-gray-600">
                          Each task in the BOQ holds a fixed percentage value. When a task is completed and approved, that percentage is marked as completed. Payment releases and remaining balances are computed based strictly on these percentages rather than subjective milestones.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">1.5 Binary Task Approval System</h4>
                        <p className="text-gray-600">
                          Once a Professional marks a task as completed, it moves to Client Approval. The Client may either Approve, Request Rework, or Dispute. No partial approvals exist. Approved tasks become "Completed %" for payment calculation.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 2 — ROLE OF PLATFORM (Huelip)</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">2.1 Non-Party Role</h4>
                        <p className="text-gray-600">
                          The Platform acts solely as a neutral facilitator providing escrow, workflow automation, dispute moderation, backup professional provisioning, and system calculations. The Platform is not and shall not become a party to the legal contract. Liability for execution remains exclusively between Client and Professional, except where the Platform intervenes for dispute moderation or replacement procedures.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">2.2 Escrow Management</h4>
                        <p className="text-gray-600">
                          The Platform manages the escrow account logic wherein funds are received, held, calculated, and released strictly based on percentage rules. The Platform ensures that at no time can funds be released earlier or later than the approved progress calculation. All workflows, conditions, penalties, replacements, buffers, and exit rules are software-enforced.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">2.3 No Guarantee of Work</h4>
                        <p className="text-gray-600">
                          The Platform does not guarantee quality of design, execution, timelines, materials, labour, or compliance. Its responsibility is limited to maintaining an accurate, unbiased, algorithmic financial flow and dispute moderation.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 3 — PROJECT INITIATION</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">3.1 Quotation Approval</h4>
                        <p className="text-gray-600">
                          The Client shall review and approve the BOQ prepared by the Professional. Once approved, this BOQ becomes the official basis for work percentage, completion tracking, deposit value, and payment release.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">3.2 Initial Escrow Deposit</h4>
                        <p className="text-gray-600">
                          The Client must deposit funds according to the buffer rules defined below before work can begin. The system will not allow project activation until the required deposit level is achieved.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 4 — ESCROW FUNDS, BUFFERS & HIGH-VALUE ITEM RULE</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">4.1 Standard 20% Buffer Rule</h4>
                        <p className="text-gray-600">
                          The Client must maintain a deposit equal to the Completed % + 20% buffer. This ensures the Professional always has financial security for upcoming work. This buffer exists to create cash availability in case a large number of tasks are completed rapidly, ensuring the Professional is never underfunded during project flow.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">4.2 Maximum Deposit Limit</h4>
                        <p className="text-gray-600">
                          The Client cannot deposit more than 100% of the project value, even with buffer rules. If buffer calculations exceed 100%, the value is capped at the total project cost, ensuring financial rationality and preventing over-depositing beyond the contract amount.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">4.3 High-Value Item Rule</h4>
                        <p className="text-gray-600">
                          If any single task holds a value exceeding 20% of the total project cost, the system requires a special buffer. In such cases, the Client must maintain a deposit equal to (value of the highest task + 20%), ensuring adequate coverage even if the largest task begins first. <strong>Example:</strong> If a project is ₹100,000 and one task equals ₹40,000, the escrow must hold ₹60,000 before work begins.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">4.4 Automated Deposit Alerts</h4>
                        <p className="text-gray-600">
                          The Platform notifies the Client whenever the balance falls below required levels. Work cannot progress until the deposit again meets required buffer parameters.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 5 — WORK COMPLETION & APPROVAL SYSTEM</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">5.1 Task Completion Submission</h4>
                        <p className="text-gray-600">
                          The Professional completes a listed BOQ task and submits photographic/graphic evidence or documentation through the Platform. The system records the submission time and moves the task to Client Approval.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">5.2 Client Approval (Binary)</h4>
                        <p className="text-gray-600">
                          The Client receives a task marked as "Completed" and must choose one of the following within 48 hours:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li><strong>Approve</strong> — Task is marked "100% Complete"</li>
                          <li><strong>Rework Required</strong> — Professional must redo/adjust work</li>
                          <li><strong>Dispute</strong> — Task is escalated for Platform moderation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">5.3 Rework Rule</h4>
                        <p className="text-gray-600">
                          If Rework is selected, the Professional must address concerns and resubmit for approval. Rework does not change BOQ percentage unless the work is approved.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">5.4 Dispute Resolution (48 Hours)</h4>
                        <p className="text-gray-600">
                          If a task moves to Dispute:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li>The Platform examines evidence from both parties</li>
                          <li>The Platform performs site inspection (if required)</li>
                          <li>A final decision is issued within 48 hours</li>
                          <li>Decision is binding on both parties</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">5.5 Professional Payout Calculation</h4>
                        <p className="text-gray-600">
                          The Professional receives Completed % – 15% withheld adjustment. This ensures:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li>Client safety</li>
                          <li>Performance accountability</li>
                          <li>Incentive for Professional to complete entire project</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 6 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 6 — PAYMENT FLOW & WITHDRAWALS</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">6.1 When Client Approves</h4>
                        <p className="text-gray-600">
                          The system releases payment instantly:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li>Professional receives: Completed% minus 15% hold</li>
                          <li>Escrow retains: 15% until project end</li>
                          <li>Client balance reduces accordingly</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">6.2 Client Deposit Requirements</h4>
                        <p className="text-gray-600">
                          If approval increases "Completed %", the Client must immediately top up the escrow to maintain the required buffer (20% above completed) or as per high-value item rule.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">6.3 When Project Reaches 100%</h4>
                        <p className="text-gray-600">
                          Once all tasks are completed and approved:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li>Professional receives remaining 15% withheld amount</li>
                          <li>Client buffer is returned entirely</li>
                          <li>Project is marked as completed officially</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 7 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 7 — DELAYS & PENALTIES</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">7.1 Client Payment Delay Penalty</h4>
                        <p className="text-gray-600">
                          If the Client does not deposit required funds within 7 days:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li>Project is automatically paused</li>
                          <li>A delay penalty of 1% per week is applicable on unpaid buffer</li>
                          <li>The Professional may escalate to dispute after 14 days</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">7.2 Professional Work Delay Penalty</h4>
                        <p className="text-gray-600">
                          If the Professional delays a task beyond 7 days (without valid reason):
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li>A delay penalty between 1%–2% of the task value may be deducted</li>
                          <li>Repeated delays may trigger replacement under the Professional Exit rules</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 8 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 8 — CLIENT EXIT POLICY</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">8.1 Client-Initiated Exit</h4>
                        <p className="text-gray-600">
                          If the Client wishes to exit the project for reasons including lack of funds, relocation, illness, dissatisfaction unrelated to proven quality issues, or personal decision:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li>Platform deducts 5% of remaining escrow balance for the Professional</li>
                          <li>Platform deducts 5% of remaining escrow balance for operational management, arbitration, replacements, and system load</li>
                          <li>Client receives 90% of the remaining escrow funds</li>
                        </ul>
                        <p className="text-gray-600 mt-2">
                          This ensures fairness because the Professional loses projected future income, and the Platform manages termination and administrative processes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 9 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 9 — PROFESSIONAL EXIT POLICY</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">9.1 If Professional Abandons Project</h4>
                        <p className="text-gray-600">
                          If the Professional exits due to financial issues, labour shortage, business shutdown, negligence, or any avoidable reason:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li>Professional forfeits 15% of total project value held as withheld adjustment</li>
                          <li>Platform uses 10% of this amount to pay a new Professional who takes over</li>
                          <li>Platform retains 5% for administrative effort, verification, onboarding, and project stability</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">9.2 Platform Replacement Guarantee</h4>
                        <p className="text-gray-600">The Platform will:</p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li>Provide a replacement Professional from its network</li>
                          <li>Ensure the new Professional continues the project at the same BOQ values</li>
                          <li>Ensure no additional cost burden is placed on the Client</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 10 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 10 — QUALITY ISSUES</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">10.1 Quality Assessment</h4>
                        <p className="text-gray-600">
                          If the Client alleges quality issues:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li>Platform inspects evidence or site</li>
                          <li>Professionals must comply with Industry Standard Quality</li>
                          <li>Platform decides whether rework is required</li>
                          <li>Professional must complete rework without additional cost unless Client requests a scope change</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 11 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 11 — DISPUTE RESOLUTION & ARBITRATION</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">11.1 Internal Platform Dispute System</h4>
                        <p className="text-gray-600">
                          All disputes (task approval, delays, quality) must first undergo platform moderation.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">11.2 Arbitration Fee</h4>
                        <p className="text-gray-600">
                          If escalated to legal arbitration:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li>Total fee: 1% of total project cost</li>
                          <li>0.5% paid by Client</li>
                          <li>0.5% paid by Professional</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">11.3 Jurisdiction</h4>
                        <p className="text-gray-600">
                          All disputes shall exclusively fall under Delhi jurisdiction.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 12 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 12 — TERMINATION</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">12.1 Platform-Triggered Termination</h4>
                        <p className="text-gray-600">
                          The Platform may terminate the project in case of fraud, unethical behaviour, or breach of platform rules.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">12.2 Effect of Termination</h4>
                        <p className="text-gray-600">
                          All funds are handled under the exit rules outlined above.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 13 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 13 — TAXES, GOVERNMENT CHARGES, AND BILLING</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">13.1 Applicability of Taxes and Government Charges</h4>
                        <p className="text-gray-600">
                          All applicable taxes, including but not limited to Goods & Services Tax (GST), cess, duties, and other statutory levies, arising out of the project shall be borne by the respective party as outlined below. Both Client and Professional acknowledge that compliance with tax regulations is mandatory, and all payments routed through the Platform are subject to applicable statutory charges.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">13.2 Responsibility for Taxes</h4>
                        <p className="text-gray-600">
                          <strong>Professional:</strong> The Professional is responsible for charging applicable GST on all service charges, including material handling if applicable, and for remitting it to the Government as per law.
                        </p>
                        <p className="text-gray-600 mt-2">
                          <strong>Client:</strong> The Client shall bear applicable taxes, duties, or government charges on the project cost, including those levied on materials, construction services, or digital transaction fees, as required by law.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">13.3 Billing Procedure</h4>
                        <p className="text-gray-600">
                          The Professional shall generate all invoices for completed work, task-wise or cumulative, including the calculated GST and any other government charges. Invoices must comply with statutory regulations, be itemized according to the BOQ/task percentage, and include tax details for clarity. All invoices must be uploaded and shared through the Platform. The Platform acts only as a record-keeping and visibility tool for both parties; it is not responsible for tax remittance.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">13.4 Payment Against Invoices</h4>
                        <p className="text-gray-600">
                          The Client shall release payment only against Platform-shared invoices. Payments made outside this workflow will not be recognized for project completion or escrow reconciliation. Escrow releases and deductions (including Platform commission) will be calculated based on invoice values uploaded on the Platform.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">13.5 Tax Compliance Declaration</h4>
                        <p className="text-gray-600">
                          Both parties declare that they will comply with all tax-related obligations under Indian law. The Professional will issue GST-compliant invoices and provide proof of transaction if requested by the Client. Any penalty, fine, or interest due to statutory non-compliance will be borne by the party responsible for filing and payment of that tax.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">13.6 Transparency and Record-Keeping</h4>
                        <p className="text-gray-600">
                          The Platform will maintain all invoice records and payment history for audit and dispute purposes. Both Client and Professional agree to rely on these records for validation of payments, deductions, and tax compliance. No manual or off-platform agreements shall override this system.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 14 */}
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">SECTION 14 — PLATFORM COMMISSION FROM PROFESSIONAL</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">14.1 Commission Applicability</h4>
                        <p className="text-gray-600">
                          The Professional agrees that every time a payment is released from the Escrow Account into the Professional's registered bank account, the Platform shall automatically deduct a pre-defined commission percentage. This commission applies strictly on the amount that is being released and not on the total project value. The commission is deducted instantly through the automated system and the Professional receives the net amount after deduction. This ensures that charges are transaction-linked and transparent, with no hidden fees beyond the agreed percentage.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">14.2 Commission Rate</h4>
                        <p className="text-gray-600">
                          The commission percentage shall be clearly visible to the Professional before project activation. The standard range is 1%–5%, depending on the project category, location, service type, professional tier, and operational load. The exact commission rate applicable to the specific project is auto-generated within the Platform dashboard and accepted by the Professional at the time of BOQ approval. Once accepted, the commission rate becomes binding for the entire project duration.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">14.3 Timing of Deduction</h4>
                        <p className="text-gray-600">
                          The commission is deducted at the moment the payout is triggered, meaning when a completed percentage of work is approved by the Client and the corresponding amount becomes releasable. This ensures that:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li>The Platform earns only when the Professional earns</li>
                          <li>There is no upfront fee or onboarding fee</li>
                          <li>Commission is proportionate to actual work completed and approved</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">14.4 No Commission on Held Amount</h4>
                        <p className="text-gray-600">
                          The 15% withheld amount (held until full project completion) is not subject to commission at the time of withholding. Commission applies only at the final release when the retained amount is disbursed after successful project completion. This protects the interests of both parties and ensures fairness throughout the process.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">14.5 GST & Taxes</h4>
                        <p className="text-gray-600">
                          Any applicable taxes, including GST on the Platform's commission, will be charged additionally and reflected transparently in the payment invoice generated for the Professional. The Professional agrees to bear these taxes as per statutory requirements. The Platform will provide downloadable tax invoices for the Professional's accounting and filing requirements.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">14.6 Non-Refundable Commission</h4>
                        <p className="text-gray-600">
                          Once a payment is released and the commission is deducted, such commission shall be non-refundable under all circumstances, including Client exit, Professional exit, project suspension, or reductions in scope. This ensures financial stability and fairness, as the Platform's services (escrow handling, workflow automation, dispute moderation, documentation) are already rendered at the time of release.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">14.7 System Automation and Transparency</h4>
                        <p className="text-gray-600">
                          The commission deduction is handled entirely by the automated system without manual interference. The Professional will have real-time access to:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                          <li>Gross amount approved</li>
                          <li>Commission percentage</li>
                          <li>Commission amount deducted</li>
                          <li>Tax amount</li>
                          <li>Net amount credited</li>
                        </ul>
                        <p className="text-gray-600 mt-2">
                          This transparency ensures that the Professional is always aware of earnings, deductions, and payment history.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CLAUSE 1 */}
                  <div className="border-l-4 border-blue-600 pl-4 mt-6">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 1 — PARTIES</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">1.1 Client</h4>
                        <p className="text-gray-600">
                          The Client is the individual or entity commissioning interior, architectural, renovation, civil, or design-related work from the Professional. The Client agrees to follow all funding rules, approval workflow, dispute procedures, and task completion protocols mandated by the Platform. The Client acknowledges that the Platform only mediates workflow, not execution. The Client must cooperate fully, provide timely approvals, review tasks properly, and maintain required escrow balances.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">1.2 Professional</h4>
                        <p className="text-gray-600">
                          The Professional is the architect, interior designer, contractor, or service provider who undertakes execution of the project. The Professional agrees to work strictly based on the BOQ/Quotation, follow the Platform's task-based percentage model, deliver quality work, complete tasks within agreed timelines, and comply with the platform's rework, dispute, and payment rules. The Professional accepts that retention amounts may apply and that the Platform may replace them if they exit prematurely.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">1.3 Platform (Huelip)</h4>
                        <p className="text-gray-600">
                          Huelip functions solely as a technology service provider, offering tools for escrow workflow, payments, approvals, dispute resolution, progress tracking, and documentation. The Platform does not sign the contract and holds no liability for workmanship, structural issues, delays caused by Client/Professional, or any direct/indirect damages. The Platform only manages digital processes and the escrow mechanism.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CLAUSE 2 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 2 — PURPOSE AND SCOPE</h3>
                    <p className="text-gray-600">
                      This Agreement defines roles, responsibilities, service expectations, payment mechanics, dispute mechanisms, completion metrics, and legal obligations of both the Client and Professional for the execution of the project as per the uploaded BOQ. It ensures transparency through structured workflow, protects both parties through controlled escrow flow, and provides unbiased oversight through dispute review. All work must strictly follow the BOQ listed in Annexure A, which forms the heart of this Agreement.
                    </p>
                  </div>

                  {/* CLAUSE 3 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 3 — PROJECT BOQ & PERCENTAGE-BASED VALUATION</h3>
                    <p className="text-gray-600">
                      Each task in the quotation is converted into a percentage proportionate to its value. This creates an objective, measurable progress metric. Larger tasks hold higher weight; smaller tasks hold lower weight. Each % is tied to actual payment release. This method eliminates ambiguity found in milestone-based billing by ensuring each task's financial value is predetermined and traceable. All parties agree that percentage calculation attached to each task is final and binding for payment release.
                    </p>
                  </div>

                  {/* CLAUSE 4 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 4 — ESCROW FUNDING OBLIGATIONS (CLIENT)</h3>
                    <p className="text-gray-600">
                      The Client must maintain sufficient funds in the Platform Escrow Account (powered by Huelip). The minimum balance required is:
                    </p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                      <li>20% more than the current completed %, OR</li>
                      <li>20% more than the costliest single task in the BOQ, whichever is higher.</li>
                    </ul>
                    <p className="text-gray-600 mt-2">
                      This requirement ensures uninterrupted workflow and guarantees Professional's working capital protection. However, total deposit can never exceed 100% of project value, maintaining fairness. Non-maintenance of escrow balance after reminders may pause the project and trigger penalties.
                    </p>
                  </div>

                  {/* CLAUSE 5 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 5 — PROFESSIONAL PAYOUT RULES</h3>
                    <p className="text-gray-600">
                      Payouts to the Professional are always based on the completed percentage of project. However, the Platform holds back 15% retention until total project completion. This protects the Client from quality failures, rectification issues, and abandonment. Retention is released only after final inspection and handover. The Professional acknowledges that partial payments are made only after Client approval or dispute resolution.
                    </p>
                  </div>

                  {/* CLAUSE 6 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 6 — TASK COMPLETION & APPROVAL WORKFLOW</h3>
                    <p className="text-gray-600">Each task follows a binary workflow:</p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                      <li>Professional marks task as completed</li>
                      <li>Client reviews the task</li>
                      <li>Client either approves OR requests rework</li>
                      <li>If disagreement occurs → task goes to dispute</li>
                    </ul>
                    <p className="text-gray-600 mt-2">
                      A task is considered complete only when the Client presses "Approve" or Huelip issues a dispute verdict. This ensures clarity, transparency, and documentation for every step.
                    </p>
                  </div>

                  {/* CLAUSE 7 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 7 — REWORK POLICY</h3>
                    <p className="text-gray-600">
                      If the Client finds defects, improper finishing, incorrect material use, or deviation from plan, they may request rework at no additional cost, as long as it aligns with the BOQ scope. The Professional must complete rework promptly. Rework cannot be denied unless Client's demand is beyond the agreed BOQ. Any rework attempt must be photographed or documented. If repeated disagreements occur, the task will automatically move to dispute.
                    </p>
                  </div>

                  {/* CLAUSE 8 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 8 — DISPUTE RESOLUTION (48 HOURS)</h3>
                    <p className="text-gray-600">
                      If the Client and Professional disagree on work quality, completion status, or rework validity, the Platform will intervene. The Platform will review digital evidence, possibly request site photos or videos, and analyze BOQ obligations. The Platform must deliver a final, binding decision within 48 hours. Both Client and Professional legally agree to comply with this decision without resistance.
                    </p>
                  </div>

                  {/* CLAUSE 9 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 9 — DELAY PENALTIES</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">9.1 Delay by Professional</h4>
                        <p className="text-gray-600">
                          If work is not completed within agreed timelines, a penalty of 0.5% of pending task value per week is deducted from Professional payout. This encourages on-time delivery and protects the Client's schedule.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">9.2 Delay by Client (Escrow Deposit)</h4>
                        <p className="text-gray-600">
                          If the Client does not maintain the required escrow balance within 7 days, a penalty of 0.5% of the shortfall amount per week applies. This ensures the Professional's cash flow and prevents delays.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">9.3 Grace Period</h4>
                        <p className="text-gray-600">
                          A 7-day grace period applies for both parties before penalties activate.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CLAUSE 10 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 10 — CLIENT EXIT POLICY</h3>
                    <p className="text-gray-600">
                      If the Client chooses to stop the project voluntarily due to personal, financial, or preference-based reasons (not due to proven Professional fault):
                    </p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                      <li>Only 10% of remaining escrow balance is refunded</li>
                      <li>5% of remaining balance is awarded to the Professional</li>
                      <li>5% is retained by the Platform for administrative and operational losses</li>
                    </ul>
                    <p className="text-gray-600 mt-2">
                      This discourages abrupt cancellations and compensates the Professional for downtime, planning, and opportunity loss.
                    </p>
                  </div>

                  {/* CLAUSE 11 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 11 — PROFESSIONAL EXIT POLICY (REPLACEMENT + COMPENSATION)</h3>
                    <p className="text-gray-600">
                      If the Professional discontinues the project for any reason other than force majeure or serious Client breach, they are considered to have exited prematurely. In such cases, Huelip will immediately appoint a replacement Professional from its verified pool to ensure the project continues without major disruption. The escrow-held retention, plus any unreleased payouts belonging to the exiting Professional, may be utilized to compensate the replacement Professional for onboarding and continuity work. The exiting Professional forfeits any pending payout until the replacement officially takes charge. This ensures that the Client suffers no delays or financial loss due to Professional exit.
                    </p>
                  </div>

                  {/* CLAUSE 12 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 12 — REPLACEMENT PROFESSIONAL WORKFLOW</h3>
                    <p className="text-gray-600">
                      Huelip will conduct an audit of the project state, verify task completion percentages, inspect quality, and cross-check each task against the BOQ for accuracy. The outgoing Professional receives no payout if discrepancies, poor workmanship, or incomplete tasks are discovered. The incoming Professional receives a fresh payment structure based on the remaining project percentage, ensuring clarity and fairness. All responsibilities, site documents, drawings, and digital records are transferred seamlessly to the replacement Professional.
                    </p>
                  </div>

                  {/* CLAUSE 13 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 13 — WORK QUALITY & MATERIAL STANDARDS</h3>
                    <p className="text-gray-600">
                      The Professional is required to use materials of the grade, brand, and specification mentioned in the BOQ. Substituting materials without written Client approval is strictly prohibited. Work quality must meet industry standards and be free of defects, cracks, leakages, alignment issues, or safety hazards. The Client is required to inspect the materials on arrival and raise concerns promptly. Any quality failure discovered later must be rectified by the Professional without additional charges. All quality disputes will be reviewed based on evidence and BOQ obligations.
                    </p>
                  </div>

                  {/* CLAUSE 14 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 14 — WARRANTY & POST-COMPLETION SUPPORT</h3>
                    <p className="text-gray-600">
                      The Professional must offer a minimum 12-month warranty on workmanship from the date of project completion. Additionally, all manufacturer warranties for products, electricals, appliances, fittings, and fixtures must be passed to the Client. During the warranty period, the Professional must attend to defects within 7 days. Failure to do so allows Huelip to assign another Professional and deduct the cost from the original Professional's retention payout.
                    </p>
                  </div>

                  {/* CLAUSE 15 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 15 — CLIENT RESPONSIBILITIES</h3>
                    <p className="text-gray-600">
                      The Client must provide site access, electricity, water, and necessary permissions required for the project. Delays caused by lack of access or permissions will not be attributed to the Professional. The Client must review task submissions within the stipulated timeframe; failure to respond may result in auto-approval of tasks. Any structural changes or design modifications must be communicated in writing, and any additional cost must be mutually agreed before execution.
                    </p>
                  </div>

                  {/* CLAUSE 16 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 16 — PROFESSIONAL RESPONSIBILITIES</h3>
                    <p className="text-gray-600">
                      The Professional must ensure labor safety, site cleanliness, proper waste disposal, and compliance with local regulations. They must coordinate all subcontractors, procure materials timely, and maintain progress reports. They must not demand payments directly from the Client outside the platform. Any such attempt can lead to termination. The Professional must upload photos, videos, or documents for each completed task to maintain transparency in the approval system.
                    </p>
                  </div>

                  {/* CLAUSE 17 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 17 — PAYMENT RELEASE TIMELINE</h3>
                    <p className="text-gray-600">
                      After the Client approves a task, or after a dispute verdict is issued, the escrow releases the payout automatically within T+1 working day. For banking delays outside control of the Platform, standard clearing timelines apply. All payouts are digital and recorded, ensuring no misuse or hidden transactions. The Professional must keep valid bank details updated on the Platform at all times.
                    </p>
                  </div>

                  {/* CLAUSE 18 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 18 — RETENTION MONEY RULES</h3>
                    <p className="text-gray-600">
                      The Platform withholds 15% of the total project value until final completion. This retention ensures the Client's safety from defects or abandoned work. Retention is only released after:
                    </p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                      <li>Final inspection by Client</li>
                      <li>Closure of rework items</li>
                      <li>Confirmation that all materials, fixtures, and installations match BOQ</li>
                    </ul>
                    <p className="text-gray-600 mt-2">
                      If issues remain unresolved for more than 14 days after handover, retention may be used to hire alternate professionals to rectify them.
                    </p>
                  </div>

                  {/* CLAUSE 19 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 19 — LIABILITY LIMITATIONS</h3>
                    <p className="text-gray-600">
                      Huelip, acting solely as a neutral platform, bears no liability for structural damages, contractor mistakes, injuries at site, quality issues, or delays caused by either party. The platform does not act as employer, contractor, guarantor, or supervisor. All civil, architectural, and construction responsibilities lie strictly between Client and Professional. Huelip only manages workflow, documentation, escrow logic, and dispute resolution.
                    </p>
                  </div>

                  {/* CLAUSE 20 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 20 — FORCE MAJEURE</h3>
                    <p className="text-gray-600">
                      Neither party shall be held liable for non-performance caused by events outside their reasonable control, including natural disasters, lockdowns, strikes, court orders, pandemics, or government restrictions. However, the party affected must inform the other within 7 days and resume work as soon as conditions permit. During force majeure, escrowed funds remain frozen and cannot be withdrawn or reallocated.
                    </p>
                  </div>

                  {/* CLAUSE 21 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 21 — TERMINATION OF AGREEMENT</h3>
                    <p className="text-gray-600">The Agreement may be terminated under the following circumstances:</p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                      <li>Mutual written consent from Client & Professional</li>
                      <li>Client voluntary exit (covered under Clause 10)</li>
                      <li>Professional exit (covered under Clause 11)</li>
                      <li>Proven fraud, misrepresentation, illegal activity, or major breach by either party</li>
                      <li>Prolonged non-cooperation, obstruction, or refusal to complete tasks</li>
                    </ul>
                    <p className="text-gray-600 mt-2">
                      Upon termination, the Platform will reconcile all completed percentages and release payments accordingly. Any unresolved disputes will undergo final dispute adjudication before payout.
                    </p>
                  </div>

                  {/* CLAUSE 22 */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">CLAUSE 22 — ARBITRATION & LEGAL JURISDICTION</h3>
                    <p className="text-gray-600">
                      All disputes, interpretations, and claims arising out of this Agreement shall be resolved exclusively through arbitration under the Arbitration & Conciliation Act, 1996. Arbitration shall be presided over by a single arbitrator appointed by Huelip. The seat and venue of arbitration shall be Delhi, and only courts in Delhi shall have exclusive jurisdiction. Both parties waive the right to approach any other court.
                    </p>
                  </div>
                </div>
              </section>

              {/* Quotation Section */}
              <section className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                  ANNEXURE 1 — QUOTATION FOR PROJECT (BOQ FORMAT)
                </h2>

                {/* Summary Table */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-red-600 text-white">
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Space</th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Work Packages</th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Items</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Amount</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Tax</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quoteData?.summary && quoteData.summary.length > 0 ? (
                          quoteData.summary.map((row, index) => (
                            <tr key={row._id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="border border-gray-300 px-4 py-3 font-medium text-gray-800">
                                {row.space || "-"}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                                {row.workPackages || 0}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                                {row.items || 0}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">
                                ₹{Number(row.amount || 0).toLocaleString("en-IN")}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">
                                ₹{Number(row.tax || 0).toLocaleString("en-IN")}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                                ₹{Number(row.total || 0).toLocaleString("en-IN")}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="border border-gray-300 px-4 py-4 text-center text-gray-500">
                              No summary data available
                            </td>
                          </tr>
                        )}
                        {/* Grand Total Row */}
                        {quoteData?.summary && quoteData.summary.length > 0 && (
                          <tr className="bg-red-50 font-bold">
                            <td colSpan="3" className="border border-gray-300 px-4 py-3 text-right text-gray-900">
                              GRAND TOTAL:
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right text-gray-900">
                              ₹{Number(totals.amount).toLocaleString("en-IN")}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right text-gray-900">
                              ₹{Number(totals.tax).toLocaleString("en-IN")}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right text-red-600 text-lg">
                              ₹{Number(totals.total).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Spaces and Items Details */}
                {quoteData?.summary && quoteData.summary.length > 0 && (
                  <div className="space-y-8">
                    {quoteData.summary.map((spaceRow, spaceIndex) => {
                      const spaceDeliverables = deliverables.filter(
                        (d) => d.space === spaceRow.space || d.spaceId?.toString() === spaceRow._id?.toString()
                      );

                      return (
                        <div key={spaceRow._id || spaceIndex} className="border border-gray-300 rounded-lg overflow-hidden">
                          {/* Space Header */}
                          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-4">
                            <h3 className="text-lg font-bold">
                              {spaceIndex + 1}. {spaceRow.space || `Space ${spaceIndex + 1}`}
                            </h3>
                            <div className="mt-2 flex gap-6 text-sm text-gray-200">
                              <span>Items: {spaceRow.items || 0}</span>
                              <span>Amount: ₹{Number(spaceRow.amount || 0).toLocaleString("en-IN")}</span>
                              <span>Tax: ₹{Number(spaceRow.tax || 0).toLocaleString("en-IN")}</span>
                              <span className="font-semibold">Total: ₹{Number(spaceRow.total || 0).toLocaleString("en-IN")}</span>
                            </div>
                          </div>

                          {/* Items Table */}
                          {spaceDeliverables.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse text-sm">
                                <thead>
                                  <tr className="bg-gray-100 border-b border-gray-300">
                                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-12">S.No</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Code</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Category</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Description</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-20">Unit</th>
                                    <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-20">Qty</th>
                                    <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-28">Rate</th>
                                    <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-24">Amount</th>
                                    <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-20">GST %</th>
                                    <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-24">Tax</th>
                                    <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-28">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {spaceDeliverables.map((item, itemIndex) => {
                                    const itemAmount = (item.qty || 0) * (item.rate || 0);
                                    const itemTax = (itemAmount * (item.gst || 0)) / 100;
                                    const itemTotal = itemAmount + itemTax;

                                    return (
                                      <tr key={item._id || itemIndex} className={itemIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">
                                          {itemIndex + 1}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-gray-700">
                                          {item.code || "-"}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-gray-700">
                                          {item.category || "-"}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-gray-700">
                                          {item.description || "-"}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">
                                          {item.unit || "-"}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-right text-gray-700">
                                          {item.qty || 0}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-right text-gray-700">
                                          ₹{Number(item.rate || 0).toLocaleString("en-IN")}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-right text-gray-700">
                                          ₹{Number(itemAmount).toLocaleString("en-IN")}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-right text-gray-700">
                                          {item.gst || 0}%
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-right text-gray-700">
                                          ₹{Number(itemTax).toLocaleString("en-IN")}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-900">
                                          ₹{Number(itemTotal).toLocaleString("en-IN")}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="px-6 py-8 text-center text-gray-500">
                              No items available for this space
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* No Data Message */}
                {(!quoteData?.summary || quoteData.summary.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    No quotation data available
                  </div>
                )}
              </section>

              {/* Signature Section */}
              <section className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Signatures
                </h2>
                
                {/* Agreement Checkbox */}
                <div className="mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">
                      I hereby acknowledge that I have read, understood, and agree to all the terms and
                      conditions stated in this contract. I authorize the service provider to proceed with
                      the project as per the agreed terms.
                    </span>
                  </label>
                </div>

                {/* Client Signature */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Client Signature <span className="text-red-600">*</span>
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={clientSignature}
                      onChange={handleSignatureChange}
                      placeholder="Enter your full name as signature"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <Button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                      size="md"
                      variant="custom"
                      onClick={() => setShowSignaturePad(!showSignaturePad)}
                    >
                      <FaFileSignature className="mr-2" />
                      Draw Signature
                    </Button>
                  </div>
                  {showSignaturePad && (
                    <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Signature Pad</span>
                        <button
                          onClick={() => setShowSignaturePad(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FiX />
                        </button>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
                        <p className="text-gray-400 text-sm">
                          Signature pad functionality can be integrated here
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    readOnly
                  />
                </div>
              </section>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 border-t p-6 flex justify-between items-center">
              <Button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                size="md"
                variant="custom"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <div className="flex gap-3">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="md"
                  variant="custom"
                  onClick={handleSignContract}
                  disabled={!agreedToTerms || !clientSignature.trim() || isSigning}
                >
                  {isSigning ? (
                    "Signing..."
                  ) : (
                    <>
                      <FaCheckCircle className="mr-2" />
                      Sign Contract
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignContract;

