import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Icon for search input
import { FiFilter } from "react-icons/fi"; // Icon for filter toggle
import { ChevronDown, Copy, FolderDown, ArrowBigUp, House, MessageCirclePlus, MessageCircle, Plus, X } from 'lucide-react'; // Icons for various UI elements
import Sidebar from "../components/Sidebar"; // Sidebar component for navigation
import * as XLSX from "xlsx"; // Library for exporting data to Excel

// Dashboard component: Main UI for managing talent members
export default function Dashboard() {
  // State for managing search input
  const [searchTerm, setSearchTerm] = useState("");
  // State to toggle visibility of the filter panel
  const [showFilters, setShowFilters] = useState(false);
  // State to track copied email for copy feedback
  const [copy, setCopy] = useState("");
  // State to track which talent's comment panel is active
  const [activeCommentTalent, setActiveCommentTalent] = useState<string | null>(null);
  // State to store comments for each talent
  const [comments, setComments] = useState<{ [key: string]: string[] }>({});
  // State to manage active tab (comments, jobComments, or logs)
  const [activeTab, setActiveTab] = useState<"comments" | "jobComments" | "logs">("comments");
  // State to manage which filter section is expanded
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  // State for selected position filters
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  // State for selected level filters
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  // State for minimum and maximum years of experience filters
  const [minExp, setMinExp] = useState(0);
  const [maxExp, setMaxExp] = useState(30);

  // Function to copy an email to clipboard and show feedback
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopy(email); // Set copied email for feedback
      setTimeout(() => setCopy(""), 2000); // Clear feedback after 2 seconds
    });
  };

  // Function to export talent data to an Excel file
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(talents); // Convert talents array to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Talent Members"); // Add worksheet to workbook
    XLSX.writeFile(workbook, "talents.xlsx"); // Download the Excel file
  };

  // Array of available job positions for filtering
  const allPositions = [
    "3D Artist/Design",
    "AI Engineer",
    "Backend Engineer",
    "Cloud Engineer",
    "CTO",
    "Data Analyst",
  ];

  // Array of available levels for filtering
  const allLevel = ["All", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
  const levelOptions = allLevel.slice(1); // Exclude "All" for individual level selection

  // Filter positions based on search term
  const filteredPositions = allPositions.filter((pos) =>
    pos.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CSS style for cursor pointer
  const cursor: React.CSSProperties[] = [{ cursor: "pointer" }];

  // Mock data for talents (replace with API data in production)
  const talents = [
    {
      Name: "jet",
      Email: "jett@yopmail.com",
      Level: "-",
      Skills: "dash, up",
      YoE: "",
      Availability: "",
      ProfileFeedback: "",
      Partner: "",
      Status: "Pending",
    },
    {
      Name: "sage",
      Email: "sage@yopmail.com",
      Level: "Senior",
      Skills: "heal, wall, revive",
      YoE: "5",
      Availability: "Full-time",
      ProfileFeedback: "Strong team support and leadership.",
      Partner: "phoenix",
      Status: "Active",
    },
    {
      Name: "phoenix",
      Email: "phoenix@yopmail.com",
      Level: "Mid",
      Skills: "flash, heal, fireball",
      YoE: "3",
      Availability: "Part-time",
      ProfileFeedback: "Energetic and confident, needs teamwork improvement.",
      Partner: "sage",
      Status: "Pending Review",
    },
  ];

  // Filter talents based on search term (by Name or Email)
  const filteredTalents = talents.filter(
    (t) =>
      t.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Interface for job comments data structure
  interface JobComment {
    companyName: string;
    position: string;
    status: {
      from: string;
      to: string;
    };
    duration: string;
  }

  // Interface for logs data structure
  interface Log {
    companyName: string;
    position: string;
    expectedSalary: string;
    skills: string;
    expertDomains: string;
    status: string;
  }

  // Mock data for job comments
  const [jobComments, setJobComments] = useState<JobComment[]>([
    {
      companyName: "DigiEx Group",
      position: "Backend Developer",
      status: {
        from: "Applied",
        to: "Proposed",
      },
      duration: "3m",
    },
  ]);

  // Mock data for logs
  const [logs, setLogs] = useState<Log[]>([
    {
      companyName: "AAT Group",
      position: "Manual Tester Intern",
      expectedSalary: "$0",
      skills: "-",
      expertDomains: "-",
      status: "Applied",
    },
    {
      companyName: "Testing Solution",
      position: "AI Engineer",
      expectedSalary: "$0",
      skills: "-",
      expertDomains: "-",
      status: "Applied",
    },
  ]);

  return (
    <div className="flex">
      {/* Sidebar component for navigation */}
      <Sidebar />

      {/* Filter panel (toggles visibility) */}
      {showFilters && (
        <div className="w-64 bg-white border-r p-4 space-y-4">
          {/* Filter header with title and clear button */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-purple-700">Filter</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-sm text-gray-500 hover:underline"
            >
              Clear All
            </button>
          </div>
          {/* Filter sections (Skills, Position, etc.) */}
          {[
            "Skills",
            "Position",
            "Total Experience",
            "Level",
            "Partners",
            "Job Availability",
            "Verify Profile",
            "Profile Status",
            "Language",
            "Talent Status",
            "Internal",
          ].map((label) => (
            <div key={label} className="border-b pb-2">
              {/* Filter section toggle button */}
              <button
                className="w-full text-left text-sm text-gray-700 font-medium flex justify-between items-center"
                onClick={() => setOpenFilter(openFilter === label ? null : label)}
              >
                {label}
                <span
                  className={`text-gray-400 transform transition-transform ${
                    openFilter === label ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown size={16} />
                </span>
              </button>
              {/* Filter content (shown when section is expanded) */}
              {openFilter === label && (
                <div className="mt-2 space-y-2">
                  {/* Skills filter (placeholder for adding skills) */}
                  {label === "Skills" && (
                    <button className="flex items-center space-x-1 text-sm text-purple-600 hover:underline">
                      <Plus size={16} />
                      <span>Add Skill</span>
                    </button>
                  )}

                  {/* Position filter with search and checkboxes */}
                  {label === "Position" && (
                    <div className="space-y-2">
                      {/* Search input for positions */}
                      <div className="relative w-full max-w-sm">
                        <input
                          type="text"
                          placeholder="Search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">
                          <FaSearch />
                        </span>
                      </div>
                      {/* Selected position tags */}
                      {selectedPositions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {selectedPositions.map((pos) => (
                            <div
                              key={pos}
                              className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {pos}
                              <button
                                onClick={() =>
                                  setSelectedPositions((prev) =>
                                    prev.filter((p) => p !== pos)
                                  )
                                }
                                className="ml-1 text-green-500 hover:text-red-500"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Checkbox list for positions */}
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {filteredPositions.map((pos) => (
                          <label
                            key={pos}
                            className="flex items-center space-x-2 text-sm text-gray-700"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPositions.includes(pos)}
                              onChange={() => {
                                setSelectedPositions((prev) =>
                                  prev.includes(pos)
                                    ? prev.filter((p) => p !== pos)
                                    : [...prev, pos]
                                );
                              }}
                              className="form-checkbox text-purple-600"
                            />
                            <span>{pos}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Total Experience filter with min/max inputs and slider */}
                  {label === "Total Experience" && (
                    <div className="space-y-4">
                      {/* Min/Max experience inputs */}
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={minExp}
                          onChange={(e) => setMinExp(Number(e.target.value))}
                          className="w-1/2 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Min"
                          min={0}
                          max={maxExp}
                        />
                        <input
                          type="number"
                          value={maxExp}
                          onChange={(e) => setMaxExp(Number(e.target.value))}
                          className="w-1/2 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Max"
                          min={minExp}
                          max={30}
                        />
                      </div>
                      {/* Quick select buttons for experience */}
                      <div className="flex space-x-2">
                        {[0, 9].map((val) => (
                          <button
                            key={val}
                            onClick={() => {
                              setMinExp(0);
                              setMaxExp(val);
                            }}
                            className="px-3 py-1 text-xs border border-purple-500 text-purple-600 rounded hover:bg-purple-50"
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                      {/* Experience range sliders */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">0</span>
                        <input
                          type="range"
                          min={0}
                          max={30}
                          value={minExp}
                          onChange={(e) => setMinExp(Number(e.target.value))}
                          className="w-full"
                        />
                        <input
                          type="range"
                          min={0}
                          max={30}
                          value={maxExp}
                          onChange={(e) => setMaxExp(Number(e.target.value))}
                          className="w-full"
                        />
                        <span className="text-xs text-gray-500">30+</span>
                      </div>
                    </div>
                  )}

                  {/* Level filter with checkboxes */}
                  {label === "Level" && (
                    <div className="space-y-2">
                      <div className="space-y-2">
                        {allLevel.map((level) => (
                          <label
                            key={level}
                            className="flex items-center space-x-2 text-sm text-gray-700"
                          >
                            <input
                              type="checkbox"
                              checked={
                                level === "All"
                                  ? levelOptions.every((opt) =>
                                      selectedLevels.includes(opt)
                                    )
                                  : selectedLevels.includes(level)
                              }
                              onChange={() => {
                                if (level === "All") {
                                  const isAllSelected = levelOptions.every((opt) =>
                                    selectedLevels.includes(opt)
                                  );
                                  setSelectedLevels(
                                    isAllSelected ? [] : [...levelOptions]
                                  );
                                } else {
                                  setSelectedLevels((prev) =>
                                    prev.includes(level)
                                      ? prev.filter((l) => l !== level)
                                      : [...prev, level]
                                  );
                                }
                              }}
                              className="form-checkbox text-purple-600"
                            />
                            <span>{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main content area */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Breadcrumb navigation */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <House size={16} />
          <span className="text-gray-400">›</span>
          <span className="font-medium text-gray-800">Talents</span>
        </div>

        {/* Header with filter toggle, title, and search/export */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded border border-gray-300 bg-white hover:bg-gray-50"
            >
              <FiFilter className="text-purple-600" />
            </button>
            <h1 className="text-2xl font-bold text-purple-700">Talent Members</h1>
            <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700">
              {filteredTalents.length} users
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search input for talents */}
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search by Email/Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <FaSearch />
              </span>
            </div>
            {/* Export button */}
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={handleExport}
            >
              <FolderDown size={15} />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Talent table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-purple-600 text-white">
              <tr>
                <div className="flex">
                  <th className="px-4 py-2 flex-1 cursor-pointer">Name</th>
                  <th className="flex-1 pr-20">
                    <ArrowBigUp />
                  </th>
                </div>
                <th className="px-4 py-2">Level</th>
                <th className="px-4 py-2">Skills</th>
                <th className="px-4 py-2">YoE</th>
                <th className="px-4 py-2">Availability</th>
                <th className="px-4 py-2">Profile Feedback</th>
                <th className="px-4 py-2">Partner</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTalents.map((talent, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      {/* Talent avatar */}
                      <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold uppercase">
                        {talent.Name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {talent.Name}
                        </div>
                        <div className="text-xs text-gray-500">{talent.Email}</div>
                      </div>
                      {/* Copy email button */}
                      <div
                        className="flex items-center space-x-2 group"
                        onClick={() => handleCopyEmail(talent.Email)}
                        style={cursor[0]}
                      >
                        <Copy
                          size={16}
                          className="text-gray-400 group-hover:text-purple-600 transition-colors"
                        />
                        {copy === talent.Email && (
                          <span className="text-green-600 text-xs font-medium">
                            Copied!
                          </span>
                        )}
                      </div>
                      {/* Placeholder for additional action */}
                      <div style={cursor[0]}>
                        <MessageCirclePlus size={16} />
                      </div>
                      {/* Comment button to open comment panel */}
                      <div
                        style={cursor[0]}
                        className="flex items-center gap-1"
                        onClick={() => setActiveCommentTalent(talent.Name)}
                      >
                        <span>{comments[talent.Name]?.length || 0}</span>
                        <MessageCircle size={16} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">{talent.Level}</td>
                  <td className="px-4 py-2">{talent.Skills}</td>
                  <td className="px-4 py-2">{talent.YoE}</td>
                  <td className="px-4 py-2">{talent.Availability}</td>
                  <td className="px-4 py-2">{talent.ProfileFeedback}</td>
                  <td className="px-4 py-2">{talent.Partner}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      {talent.Status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comment panel (shown when a talent's comment button is clicked) */}
        {activeCommentTalent && (
          <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg border-l z-50 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-700">
                Comments for {activeCommentTalent}
              </h2>
              <button
                onClick={() => setActiveCommentTalent(null)}
                className="text-sm text-gray-500 hover:underline"
              >
                Close
              </button>
            </div>
            <div className="mb-4">
              {/* Tabs for comments, job comments, and logs */}
              <div className="flex space-x-4 border-b pb-2 mb-4">
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`${
                    activeTab === "comments"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-purple-600"
                  } font-medium`}
                >
                  Comments
                </button>
                <button
                  onClick={() => setActiveTab("jobComments")}
                  className={`${
                    activeTab === "jobComments"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-purple-600"
                  } font-medium`}
                >
                  Job Comments
                </button>
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`${
                    activeTab === "logs"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-purple-600"
                  } font-medium`}
                >
                  Logs
                </button>
              </div>

              {/* Comments tab content */}
              {activeTab === "comments" && (
                <>
                  <ul className="space-y-3">
                    {(comments[activeCommentTalent] || []).map((cmt, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-800 border-b pb-2"
                      >
                        {cmt}
                        <div className="text-xs text-gray-400">Reply</div>
                      </li>
                    ))}
                  </ul>
                  {/* Input for adding new comments */}
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-4"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        const newComment = e.currentTarget.value.trim();
                        setComments((prev) => ({
                          ...prev,
                          [activeCommentTalent]: [
                            ...(prev[activeCommentTalent] || []),
                            newComment,
                          ],
                        }));
                        e.currentTarget.value = ""; // Clear input
                      }
                    }}
                  />
                </>
              )}

              {/* Job Comments tab content */}
              {activeTab === "logs" && (
                <div className="space-y-4">
                  {jobComments.map((comment, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{comment.companyName}</span>
                        <span className="text-sm text-gray-500">
                          • {comment.position}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>From: {comment.status.from}</span>
                        <span>To: {comment.status.to}</span>
                        <span className="text-gray-500">
                          • Duration: {comment.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Logs tab content */}
              {activeTab === "jobComments" && (
                <div className="space-y-4">
                  {logs.map((log, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{log.position}</span>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            {log.status}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Company name</span>
                            <span>{log.companyName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Expected salary
                            </span>
                            <span>{log.expectedSalary}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Skills</span>
                            <span>{log.skills}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Expert domains</span>
                            <span>{log.expertDomains}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}