import { Application, FormCode } from "../types";

const APP_IDS = [
  "1000000224","1000000226","1000000227","1000000228","1000000229","1000000225",
  "1000000233","1000000232","1000000231","1000000235","1000000234","1000000242",
  "1000000243","1000000236","1000000238","1000000237","1000000239","1000000245",
  "1000000256","1000000246","1000000247","1000000248","1000000249","1000000250",
  "1000000251","1000000252","1000000254","1000000244","1000000255","1000000253",
  "1000000257","1000000258","1000000230","1000000259",
];

const NAMES = [
  "Aarav Sharma","Priya Verma","Rohit Singh","Ananya Mishra","Vikram Yadav",
  "Sneha Tiwari","Arjun Pandey","Kavya Srivastava","Rahul Chauhan","Meera Dubey",
  "Karan Saxena","Neha Agarwal","Aditya Bajpai","Pooja Shukla","Sanjay Tripathi",
  "Divya Joshi","Manish Pathak","Ritu Bhardwaj","Ankit Gupta","Shreya Kapoor",
  "Nikhil Awasthi","Isha Malhotra","Harsh Vardhan","Tanvi Nigam","Yash Rastogi",
  "Aisha Khan","Devansh Rai","Pallavi Sengar","Mohit Bansal","Swati Chaturvedi",
  "Rajat Kulkarni","Anjali Bhatt","Saurabh Mehrotra","Nidhi Gaur",
];

const DISTRICTS = [
  "Lucknow","Kanpur","Varanasi","Agra","Prayagraj","Meerut","Ghaziabad",
  "Noida","Bareilly","Aligarh","Gorakhpur","Jhansi",
];

const PROFESSIONS = [
  "Physiotherapist","Medical Lab Technologist","Radiographer","Optometrist",
  "Occupational Therapist","Audiologist","Dialysis Technologist","Nutritionist",
];

const FORM_CODES: FormCode[] = ["1A","1B","1C","2A","3A","3B","3C","4A"];

// Bucket distribution: new=10, evaluated_recommended=5, evaluated_not_recommended=3,
// forwarded=5, uid=6, certificate=5  => total 34
const BUCKET_PLAN: Application["bucket"][] = [
  ...Array(10).fill("new"),
  ...Array(5).fill("evaluated_recommended"),
  ...Array(3).fill("evaluated_not_recommended"),
  ...Array(5).fill("forwarded"),
  ...Array(6).fill("uid"),
  ...Array(5).fill("certificate"),
];

const today = new Date();
const daysAgo = (d: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() - d);
  return dt.toISOString();
};

export const MOCK_APPLICATIONS: Application[] = APP_IDS.map((id, i) => {
  const bucket = BUCKET_PLAN[i] ?? "new";
  const formCode = FORM_CODES[i % FORM_CODES.length];
  const submittedAt = daysAgo((i * 3) % 60 + 1);
  const base: Application = {
    applicationId: id,
    applicantName: NAMES[i % NAMES.length],
    formCode,
    submittedAt,
    bucket,
    district: DISTRICTS[i % DISTRICTS.length],
    profession: PROFESSIONS[i % PROFESSIONS.length],
  };

  if (bucket === "forwarded") {
    base.forwardedAt = daysAgo(((i * 2) % 10) + 1);
  }
  if (bucket === "uid" || bucket === "certificate") {
    base.uid = `UP-NCAHP-${2024}-${String(50000 + i).padStart(6, "0")}`;
  }
  if (bucket === "certificate") {
    base.certificateNo = `CERT/UP/${2024}/${String(1000 + i).padStart(5, "0")}`;
    base.certificateIssuedAt = daysAgo((i % 20) + 1);
  }
  if (bucket === "evaluated_not_recommended") {
    base.rejectionReason = "Incomplete academic credentials";
  }
  return base;
});
