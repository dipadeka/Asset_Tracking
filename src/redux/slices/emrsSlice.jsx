import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
 
// ─── SUBMIT THUNK ───────────────────────────────────────────
export const submitEMRSForm = createAsyncThunk(
  'emrs/submitForm',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/emrs', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Server error' });
    }
  }
);
 
// ─── DEFAULT ROW FACTORIES ───────────────────────────────────
const blankEnrollmentRow = () => ({
  academicYear: '', class: '', section: '',
  sanctionedCapacity: '', currentEnrollment: '',
  categoryBreakdown: { ST: {}, PVTG: {}, DNT_NT_SNT: {}, LWE_Covid: {}, Widow: {}, Divyang: {}, LandDonor: {} },
  appeared: '', passed: '', passPercent: '', marks: '',
  stream: '', topScorer: '', topScore: '',
  monthlyAttendance: [],
  dropouts:    [{ studentName: '', rollNo: '', reason: '', guardianName: '', guardianContactNo: '', pinCode: '', district: '', postOffice: '', gramPanchayat: '', village: '' }],
  migrations:  [{ studentName: '', migratedFrom: '', transferredTo: '', reason: '' }],
  achievements:[{ studentName: '', eventName: '', level: '', recognition: '' }],
  competitiveExam: { examName: '', qualified: '', admission: '', total: '', marks: '' },
});
 
const blankHospRow = () => ({
  hospitalEmpanelled: '', privateHospital: '', empanelmentDepartment: '', doctorName: '',
  studentName: '', rollNo: '', class: '', section: '', guardianName: '', guardianContact: '',
  admissionDate: '', dischargeDate: '', reasonForHospitalization: '',
  estimatedCost: '', amountClaimed: '', claimStatus: '',
  'Annual Health Check Conducted': '', 'Part-Time Doctor Engaged': '',
  'Medical Register Maintained': '', 'Sickle Cell Screening Conducted': '',
  'ABHA ID Created': '', 'Eye Checkup Conducted': '', 'Ear Checkup Conducted': '',
  marksHealth: undefined,
  eyeEntries:  [{ eyeSpecialistName: '', eyeCheckupDate: '', eyeClass: '', eyeSection: '', eyeStudentsScreened: '', eyeStudentsWithProblem: '', eyeNeedsSpectacle: '', eyeNeedsHigherInvestigation: '' }],
  earEntries:  [{ earSpecialistName: '', earCheckupDate: '', earClass: '', earSection: '', earStudentsScreened: '', earStudentsWithProblem: '', earNeedsEquipment: '' }],
  nurseEntries:[{ nurseName: '', nurseQualification: '', nurseRegNo: '', nurseContact: '', nurseShift: '', nurseJoiningDate: '' }],
  visitingDoctorName: '', visitingDoctorSpecialization: '', visitingDoctorRegNo: '',
  visitingDoctorContact: '', scheduledVisitTime: '',
  doctorVisitLogs: [{ visitDate: '', actualVisitTime: '', visitStatus: '', remarks: '' }],
  counsellorName: '', counsellorQualification: '', counsellorRegNo: '',
  counsellorContact: '', counsellorAvailableDays: [], counsellorSessionType: '',
  counsellorSessionsConducted: '', counsellorStudentsCounselled: '', 
  empanellementValidity: '',
  treatmentDetails: '',
});
 
const blankStaffRow = (withTET = true) => ({
  post: '', name: '', dob: '', doj: '', email: '', contact: '',
  total: '', filled: '', vacant: '', monthlyAttendance: [],
  academicQualifications:     [{ qualification: '', course: '', registrationNo: '', rollNo: '', college: '', marksObtained: '', university: '', passingYear: '' }],
  professionalQualifications: [{ qualification: '', registrationNo: '', rollNo: '', examConductedBy: '', passingYear: '', marksObtained: '', affiliationBody: '' }],
  ...(withTET && { tetQualifications: [{ qualification: '', registrationNo: '', rollNo: '', examConductedBy: '', passingYear: '', marksObtained: '', affiliationBody: '' }] }),
});
 
const makeConstrRows = (names) =>
  names.map((component) => ({ component, units: '', status: 'Not Started', progress: 0, startDate: '', endDate: '', assignedTo: '', budget: '', remarks: '' }));
 
const defaultConstructionRows = {
  school:    makeConstrRows(['Classrooms','Teachers Staff Room','Student Lab','Library','Science Lab','↳ Biology Lab','↳ Chemistry Lab','↳ Physics Lab','Mathematics Lab','Auditorium','Infirmary']),
  residence: makeConstrRows(['Boys Hostel','Girls Hostel','Water System','Warden Office','Recreation Area','Laundry Area','Kitchen','Staff Housing']),
  outdoor:   makeConstrRows(['Compound Wall','Garden','Worker Toilets','Parking']),
  utilities: makeConstrRows(['Electrical System','↳ Transformer Installed','↳ Digiset Installed','Water Tanks','Sewage System','Rainwater Harvest','Security Cabin']),
};
 
// ─── HELPERS ─────────────────────────────────────────────────
const calcHealthMarks = (row) => {
  const keys = ['Annual Health Check Conducted','Part-Time Doctor Engaged','Medical Register Maintained',
    'Sickle Cell Screening Conducted','ABHA ID Created','Eye Checkup Conducted','Ear Checkup Conducted'];
  const yes = keys.filter((k) => row[k] === 'Yes').length;
  if (yes === 7) return 9; if (yes >= 5) return 7;
  if (yes >= 3)  return 5; if (yes >= 1) return 3; return 0;
};
 
const calcFundMarks = (pct) => {
  const p = parseFloat(pct);
  if (isNaN(p)) return 0;
  if (p >= 95) return 5; if (p >= 70) return 3; if (p >= 50) return 1; return 0;
};
 
const calcLabMarks = (inf) => {
  const fields = ['physicsLabFunctional','chemistryLabFunctional','biologyLabFunctional',
    'computerLabFunctional','mathLabFunctional','skillLabFunctional'];
  const yes = fields.filter((f) => inf[f] === 'Yes').length;
  if (yes === 6) return 5; if (yes >= 3) return 3; if (yes >= 1) return 1; return 0;
};
 
// ─── INITIAL STATE ────────────────────────────────────────────
const initialState = {
  currentStep: 0,
  loading: false,
  submitSuccess: false,
  error: null,
  submittedForms: [],
 
  // Step 0
  basicDetails:    { EMRScode: '', udaisecode: '', schoolname: '', schooltype: '', Affiliation: '', principalAvailable: '', NameofthePrincipal: '', contactno: '', emailid: '' },
  locationDetails: { pincode: '', state: '', district: '', block: '', gramPanchayat: '', Village: '' },
 
  // Step 1
  infrastructure: {
    totalClassrooms: '', classroomWithSmartClass: '', classroomWithProjector: '',
    scienceLab: '', biologyLab: '', chemistryLab: '', physicsLab: '',
    computerLab: '', internetComputerLab: '', library: '', booksInLibrary: '',
    playground: '', playgroundArea: '', Auditorium: '', auditoriumCapacity: '',
    'Medical Room': '', totalFireExtinguishers: '', functionalFireExtinguishers: '',
    electricalSafetyInspection: '', fireSafetyDrill: '',
    physicsLabFunctional: '', chemistryLabFunctional: '', biologyLabFunctional: '',
    computerLabFunctional: '', mathLabFunctional: '', skillLabFunctional: '',
    marksLabFunctional: '',
  },
 
  // Step 2
  construction: { projectStartDate: '', projectEndDate: '', totalProjectBudget: '', rows: defaultConstructionRows },
 
  // Step 3
  hostel: {
    boysHostelCapacity: '', boysBedsAvailable: '', boysCurrentOccupancy: '',
    boysCCTVInstalled: '', boysNoOfCCTV: '', boysSecurityAgency: '',
    boysSecurityAgencyName: '', boysSecurityAgencyContact: '',
    boysWardenName: '', boysWardenEmail: '', boysWardenContact: '',
    girlsHostelCapacity: '', girlsBedsAvailable: '', girlsCurrentOccupancy: '',
    girlsCCTVInstalled: '', girlsNoOfCCTV: '', girlsSecurityAgency: '',
    girlsSecurityAgencyName: '', girlsSecurityAgencyContact: '',
    girlsWardenName: '', girlsWardenEmail: '', girlsWardenContact: '',
  },
  messData: {
    year: '2026', month: 'March', purchaseDate: '', billNo: '', paymentMethod: '',
    items: [{ category: '', name: '', quantity: '', unit: '', price: '', total: 0 }],
    weeklyMenuDisplayed: '', messInspectionRegister: '', foodStockRegister: '',
    foodComplaintRegister: '', messCleanlinessDaily: '',
  },
 
  // Step 4
  enrollmentRows: [blankEnrollmentRow()],
 
  // Step 5
  extraCurricularRows: [{ academicYear: '', initiativeName: '', collaboratingPartner: '', areasOfDevelopment: '', otherAreaOfDevelopment: '', description: '', targetStudents: '', status: '' }],
  extraCurricularSpecial: {
    studentsParticipatedCulturalMeet: '', studentsParticipatedCount: '',
    studentsGotMedalCulturalMeet: '', studentsRankCount: '',
    nccUnitRunning: '', nccStudentsCount: '',
    scoutGuideRunning: '', scoutGuideStudentsCount: '',
    studentsSelectedRBVP: '', rbvpStudentsCount: '',
    studentsSelectedInspireManak: '', inspireStudentsCount: '',
  },
 
  // Step 6
  hospitalizationRows: [blankHospRow()],
 
  // Step 7
  teachingRows:    [blankStaffRow(true)],
  nonTeachingRows: [blankStaffRow(false)],
 
  // Step 8
  attendance: {
    selectedClass: '', selectedSection: '', monthYear: '',
    monthlyAttendance: [{ month: '', workingDays: '', totalStudents: '', present: '' }],
    teachRows: [{ id: 1, post: '', name: '', workingDays: '', cl: '', el: '', ml: '', mat: '' }],
    ntRows:    [{ id: 1, post: '', name: '', workingDays: '', cl: '', el: '', ml: '', mat: '' }],
  },
 
  // Step 9
  operationalCostRows: [{ year: '', month: '', costType: '', amount: '' }],
 
  // Step 10
  financial: { academicYear: '', totalFundsAllocated: '', totalFundsUtilized: '', utilizationPercentage: 0, fundUtilMarksObtained: 0, auditConducted: '' },
  procurements: [],
  recurringBreakup: [
    { sno: '1',  component: 'Staff Salary (53.85%)',                            colA: '', colC: '', colD: '', colE: '', remarks: '' },
    { sno: '2',  component: 'Direct Expenditure on Students (23.78%)',          colA: '', colC: '', colD: '', colE: '', remarks: '' },
    { sno: '3a', component: 'Operational Expenditure & Co-Curricular (13.62%)', colA: '', colC: '', colD: '', colE: '', remarks: '' },
    { sno: '3b', component: 'Maintenance & Repair of Buildings (4.75%)',        colA: '', colC: '', colD: '', colE: '', remarks: '' },
    { sno: '4',  component: 'Administrative Expense of State Society (1.91%)',  colA: '', colC: '', colD: '', colE: '', remarks: '' },
    { sno: '5',  component: 'Capital Expenditure (2.09%)',                      colA: '', colC: '', colD: '', colE: '', remarks: '' },
  ],
 
  // Step 11
  emrsImage: null,
};
 
// ─── SLICE ────────────────────────────────────────────────────
const emrsSlice = createSlice({
  name: 'emrs',
  initialState,
  reducers: {
    // Navigation
    setCurrentStep: (s, a) => { s.currentStep = a.payload; },
    nextStep: (s) => { if (s.currentStep < 11) s.currentStep += 1; },
    prevStep: (s) => { if (s.currentStep > 0)  s.currentStep -= 1; },
 
    // Generic spread updaters — Steps 0, 3, 5, 8
    updateBasicDetails:           (s, a) => { s.basicDetails           = { ...s.basicDetails,           ...a.payload }; },
    updateLocationDetails:        (s, a) => { s.locationDetails        = { ...s.locationDetails,        ...a.payload }; },
    updateHostel:                 (s, a) => { s.hostel                 = { ...s.hostel,                 ...a.payload }; },
    updateMessData:               (s, a) => { s.messData               = { ...s.messData,               ...a.payload }; },
    updateExtraCurricularSpecial: (s, a) => { s.extraCurricularSpecial = { ...s.extraCurricularSpecial, ...a.payload }; },
    updateAttendanceState:        (s, a) => { s.attendance             = { ...s.attendance,             ...a.payload }; },
 
    // Step 1 — auto-recalc lab marks
    updateInfrastructure: (s, a) => {
      s.infrastructure = { ...s.infrastructure, ...a.payload };
      s.infrastructure.marksLabFunctional = calcLabMarks(s.infrastructure);
    },
 
    // Step 2
    updateConstructionOverview: (s, a) => { s.construction = { ...s.construction, ...a.payload }; },
    updateConstructionRow: (s, { payload: { catKey, rowIndex, field, value } }) => {
      const row = s.construction.rows[catKey][rowIndex];
      row[field] = value;
      if (field === 'status') {
        if (value === 'Completed')  row.progress = 100;
        if (value === 'Not Started') row.progress = 0;
      }
    },
 
    // Mess items
    addMessItem:    (s) => { s.messData.items.push({ category: '', name: '', quantity: '', unit: '', price: '', total: 0 }); },
    removeMessItem: (s, a) => { s.messData.items.splice(a.payload, 1); },
    updateMessItem: (s, { payload: { index, field, value } }) => {
      const item = s.messData.items[index];
      item[field] = ['quantity', 'price'].includes(field) ? Math.max(0, value) : value;
      item.total  = parseFloat(item.quantity || 0) * parseFloat(item.price || 0);
    },
 
    // Step 4 — Enrollment
    addEnrollmentRow:    (s) => { s.enrollmentRows.push(blankEnrollmentRow()); },
    removeEnrollmentRow: (s, a) => { s.enrollmentRows.splice(a.payload, 1); },
    updateEnrollmentRow: (s, { payload: { rowIndex, field, value } }) => { s.enrollmentRows[rowIndex][field] = value; },
    updateCategoryBreakdown: (s, { payload: { rowIndex, catKey, level, value } }) => {
      if (!s.enrollmentRows[rowIndex].categoryBreakdown[catKey]) s.enrollmentRows[rowIndex].categoryBreakdown[catKey] = {};
      s.enrollmentRows[rowIndex].categoryBreakdown[catKey][level] = value;
    },
    // Shared handler for dropouts / migrations / achievements / monthlyAttendance inside enrollmentRows
    addSubRow:    (s, { payload: { rowIndex, subKey, blank } }) => { s.enrollmentRows[rowIndex][subKey].push(blank); },
    updateSubRow: (s, { payload: { rowIndex, subKey, idx, field, value } }) => { s.enrollmentRows[rowIndex][subKey][idx][field] = value; },
    removeSubRow: (s, { payload: { rowIndex, subKey, idx } }) => { s.enrollmentRows[rowIndex][subKey].splice(idx, 1); },
 
    // Step 5 — Extra curricular
    addExtraCurricularRow:    (s) => { s.extraCurricularRows.push({ academicYear: '', initiativeName: '', collaboratingPartner: '', areasOfDevelopment: '', otherAreaOfDevelopment: '', description: '', targetStudents: '', status: '' }); },
    removeExtraCurricularRow: (s, a) => { s.extraCurricularRows.splice(a.payload, 1); },
    updateExtraCurricularRow: (s, { payload: { index, field, value } }) => { s.extraCurricularRows[index][field] = value; },
 
    // Step 6 — Hospitalization (auto health marks)
    addHospitalizationRow:    (s) => { s.hospitalizationRows.push(blankHospRow()); },
    removeHospitalizationRow: (s, a) => { s.hospitalizationRows.splice(a.payload, 1); },
    updateHospitalizationRow: (s, { payload: { index, field, value } }) => {
      s.hospitalizationRows[index][field] = value;
      s.hospitalizationRows[index].marksHealth = calcHealthMarks(s.hospitalizationRows[index]);
    },
    // Shared handler for eyeEntries / earEntries / nurseEntries / doctorVisitLogs
    addHospSubEntry:    (s, { payload: { rowIndex, subKey, blank } }) => { s.hospitalizationRows[rowIndex][subKey].push(blank); },
    removeHospSubEntry: (s, { payload: { rowIndex, subKey, idx  } }) => { s.hospitalizationRows[rowIndex][subKey].splice(idx, 1); },
    updateHospSubEntry: (s, { payload: { rowIndex, subKey, idx, field, value } }) => { s.hospitalizationRows[rowIndex][subKey][idx][field] = value; },
 
    // Step 7 — Teaching staff
    addTeachingRow:    (s) => { s.teachingRows.push(blankStaffRow(true)); },
    removeTeachingRow: (s, a) => { s.teachingRows.splice(a.payload, 1); },
    updateTeachingRow: (s, { payload: { index, field, value } }) => { s.teachingRows[index][field] = value; },
    updateTeachingQual: (s, { payload: { staffIndex, qualType, qIndex, field, value } }) => { s.teachingRows[staffIndex][qualType][qIndex][field] = value; },
    addTeachingQualRow: (s, { payload: { staffIndex, qualType, blank } }) => { s.teachingRows[staffIndex][qualType].push(blank); },
 
    // Step 7 — Non-teaching staff
    addNonTeachingRow:    (s) => { s.nonTeachingRows.push(blankStaffRow(false)); },
    removeNonTeachingRow: (s, a) => { s.nonTeachingRows.splice(a.payload, 1); },
    updateNonTeachingRow: (s, { payload: { index, field, value } }) => { s.nonTeachingRows[index][field] = value; },
    updateNonTeachingQual: (s, { payload: { staffIndex, qualType, qIndex, field, value } }) => { s.nonTeachingRows[staffIndex][qualType][qIndex][field] = value; },
    addNonTeachingQualRow: (s, { payload: { staffIndex, qualType, blank } }) => { s.nonTeachingRows[staffIndex][qualType].push(blank); },
 
    // Step 8 — Attendance rows (teachRows / ntRows share same handler via `key`)
    addAttendanceRow:    (s, { payload: { key } }) => { s.attendance[key].push({ id: Date.now(), post: '', name: '', workingDays: '', cl: '', el: '', ml: '', mat: '' }); },
    removeAttendanceRow: (s, { payload: { key, id } }) => { s.attendance[key] = s.attendance[key].filter((r) => r.id !== id); },
    updateAttendanceRow: (s, { payload: { key, id, field, value } }) => {
      const row = s.attendance[key].find((r) => r.id === id);
      if (row) row[field] = value;
    },
    addStudentMonthlyAtt:    (s) => { s.attendance.monthlyAttendance.push({ month: '', workingDays: '', totalStudents: '', present: '' }); },
    removeStudentMonthlyAtt: (s, a) => { s.attendance.monthlyAttendance.splice(a.payload, 1); },
    updateStudentMonthlyAtt: (s, { payload: { idx, field, value } }) => { s.attendance.monthlyAttendance[idx][field] = value; },
 
    // Step 9 — Operational cost
    addOperationalCostRow:    (s, a) => { s.operationalCostRows.splice((a.payload ?? s.operationalCostRows.length - 1) + 1, 0, { year: '', month: '', costType: '', amount: '' }); },
    removeOperationalCostRow: (s, a) => { if (s.operationalCostRows.length > 1) s.operationalCostRows.splice(a.payload, 1); },
    updateOperationalCostRow: (s, { payload: { index, field, value } }) => { s.operationalCostRows[index][field] = value; },
 
    // Step 10 — Financial (auto utilization % + marks)
    updateFinancial: (s, { payload: { field, value } }) => {
      s.financial[field] = value;
      if (['totalFundsAllocated', 'totalFundsUtilized'].includes(field)) {
        const alloc = parseFloat(field === 'totalFundsAllocated' ? value : s.financial.totalFundsAllocated);
        const util  = parseFloat(field === 'totalFundsUtilized'  ? value : s.financial.totalFundsUtilized);
        if (!isNaN(alloc) && alloc > 0 && !isNaN(util) && util >= 0) {
          const pct = (util / alloc) * 100;
          s.financial.utilizationPercentage = parseFloat(pct.toFixed(2));
          s.financial.fundUtilMarksObtained = calcFundMarks(pct);
        } else {
          s.financial.utilizationPercentage = 0;
          s.financial.fundUtilMarksObtained = 0;
        }
      }
    },
    addProcurement:         (s, a) => { s.procurements.push(a.payload); },
    removeProcurement:      (s, a) => { s.procurements.splice(a.payload, 1); },
    updateRecurringBreakup: (s, { payload: { index, field, value } }) => { s.recurringBreakup[index][field] = value; },
 
    // Step 11 / misc
    setEMRSImage:     (s, a) => { s.emrsImage = a.payload; },
    clearError:       (s)    => { s.error = null; },
    resetForm:        ()     => initialState,
    addSubmittedForm: (s, a) => { s.submittedForms.unshift(a.payload); },
  },
 
  extraReducers: (builder) => {
    builder
      .addCase(submitEMRSForm.pending,   (s) => { s.loading = true; s.error = null; s.submitSuccess = false; })
      .addCase(submitEMRSForm.fulfilled, (s, a) => {
        s.loading = false;
        s.submitSuccess = true;
        s.submittedForms.unshift({ id: a.payload._id || Date.now(), schoolname: a.payload.schoolname, EMRScode: a.payload.EMRScode, district: a.payload.district, submittedAt: new Date().toLocaleString() });
      })
      .addCase(submitEMRSForm.rejected,  (s, a) => { s.loading = false; s.error = a.payload?.message || 'Submission failed'; });
  },
});
 
export const {
  setCurrentStep, nextStep, prevStep,
  updateBasicDetails, updateLocationDetails, updateInfrastructure,
  updateConstructionOverview, updateConstructionRow,
  updateHostel, updateMessData, addMessItem, removeMessItem, updateMessItem,
  addEnrollmentRow, removeEnrollmentRow, updateEnrollmentRow, updateCategoryBreakdown,
  addSubRow, updateSubRow, removeSubRow,
  addExtraCurricularRow, removeExtraCurricularRow, updateExtraCurricularRow, updateExtraCurricularSpecial,
  addHospitalizationRow, removeHospitalizationRow, updateHospitalizationRow,
  addHospSubEntry, removeHospSubEntry, updateHospSubEntry,
  addTeachingRow, removeTeachingRow, updateTeachingRow, updateTeachingQual, addTeachingQualRow,
  addNonTeachingRow, removeNonTeachingRow, updateNonTeachingRow, updateNonTeachingQual, addNonTeachingQualRow,
  updateAttendanceState, addAttendanceRow, removeAttendanceRow, updateAttendanceRow,
  addStudentMonthlyAtt, removeStudentMonthlyAtt, updateStudentMonthlyAtt,
  addOperationalCostRow, removeOperationalCostRow, updateOperationalCostRow,
  updateFinancial, addProcurement, removeProcurement, updateRecurringBreakup,
  setEMRSImage, clearError, resetForm, addSubmittedForm,
} = emrsSlice.actions;
 
export default emrsSlice.reducer;