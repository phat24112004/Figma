import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import {
  ChevronDown,
  Copy,
  FolderDown,
  House,
  MessageCirclePlus,
  MessageCircle,
  Plus,
  X,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import * as XLSX from "xlsx";
import axios from "axios";

export default function Dashboard() {
  // === STATES ===
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [copy, setCopy] = useState("");
  const [activeCommentTalent, setActiveCommentTalent] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: string[] }>({});
  const [activeTab, setActiveTab] = useState<"comments" | "jobComments" | "logs">("comments");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [minExp, setMinExp] = useState(0);
  const [maxExp, setMaxExp] = useState(30);

  // API DATA STATES 
  const [talents, setTalents] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // CONSTANTS
  const allPositions = [
    "3D Artist/Design",
    "AI Engineer",
    "Backend Engineer",
    "Cloud Engineer",
    "CTO",
    "Data Analyst",
  ];
  const allLevel = ["All", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
  const levelOptions = allLevel.slice(1);
  const cursor: React.CSSProperties[] = [{ cursor: "pointer" }];

  // FILTERED TALENTS 
  const filteredTalents = talents.filter((t) =>
    (t.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // FETCH DATA FROM API
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    console.log("Token:", token); // check token exist

    if (!token) {
      setError("not found.");
      setLoading(false);
      return;
    }

    const fetchListData = async () => {
      try {
        setLoading(true);
        setError("");

        const payload = {
          page: 1,
          size: 30,
          skill_filter_requests: [],
          job_positions: [],
          partner_ids: [],
          expert_domains: [],
          languages: [],
          levels: [],
          profile_feedbacks: [],
          statuses: [],
        };

        const res = await axios.post("https://dev-api.talentx.asia/api/v1/users/list", payload, {
          headers: {
            "Auth-Token": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // IN RA CONSOLE ĐỂ XEM CẤU TRÚC THẬT
        // console.log("FULL API RESPONSE:", res.data);
        // console.log("DATA ARRAY:", res.data.data);

        // list data: res.data.data
        const apiTalents = Array.isArray(res.data.data) ? res.data.data : [];
        setTalents(apiTalents);

        if (apiTalents.length === 0) {
          setError("Danh sách rỗng. Có thể không có dữ liệu hoặc filter sai.");
        }
      } catch (err) {
        console.error("API ERROR:", err);
        console.error("Response:", err);
        setError(`${err}Lỗi kết nối API`);
      } finally {
        setLoading(false);
      }
    };

    fetchListData();
  }, []);

  // HANDLERS
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopy(email);
      setTimeout(() => setCopy(""), 2000);
    });
  };

  const handleExport = () => {
    const exportData = filteredTalents.map((t) => ({
      Name: t.full_name || "-",
      Email: t.email || "-",
      Level: t.level || "-",
      Skills: Array.isArray(t.skills) ? t.skills.join(", ") : t.skills || "-",
      YoE: t.years_of_experience ?? "-",
      Availability: t.availability || "-",
      ProfileFeedback: t.profile_feedback || "-",
      Partner: t.partner || "-",
      Status: t.status || "Pending",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Talent Members");
    XLSX.writeFile(workbook, "talents.xlsx");
  };

  // MOCK JOB COMMENTS & LOGS
  interface JobComment {
    companyName: string;
    position: string;
    status: { from: string; to: string };
    duration: string;
  }
  // interface Log {
  //   companyName: string;
  //   position: string;
  //   expectedSalary: string;
  //   skills: string;
  //   expertDomains: string;
  //   status: string;
  // }

  const [jobComments] = useState<JobComment[]>([
    {
      companyName: "DigiEx Group",
      position: "Backend Developer",
      status: { from: "Applied", to: "Proposed" },
      duration: "3m",
    },
  ]);

  // const [logs] = useState<Log[]>([
  //   {
  //     companyName: "AAT Group",
  //     position: "Manual Tester Intern",
  //     expectedSalary: "$0",
  //     skills: "-",
  //     expertDomains: "-",
  //     status: "Applied",
  //   },
  //   {
  //     companyName: "Testing Solution",
  //     position: "AI Engineer",
  //     expectedSalary: "$0",
  //     skills: "-",
  //     expertDomains: "-",
  //     status: "Applied",
  //   },
  // ]);

  return (
    <div className="flex">
      <Sidebar />

      {/* Filter Panel */}
      {showFilters && (
        <div className="w-64 bg-white border-r p-4 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-purple-700">Filter</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-sm text-gray-500 hover:underline"
            >
              Clear All
            </button>
          </div>

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

              {openFilter === label && (
                <div className="mt-2 space-y-2">
                  {label === "Skills" && (
                    <button className="flex items-center space-x-1 text-sm text-purple-600 hover:underline">
                      <Plus size={16} />
                      <span>Add Skill</span>
                    </button>
                  )}

                  {label === "Position" && (
                    <div className="space-y-2">
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
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {allPositions
                          .filter((pos) =>
                            pos.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((pos) => (
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

                  {label === "Total Experience" && (
                    <div className="space-y-4">
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

                  {label === "Level" && (
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
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <House size={16} />
          <span className="text-gray-400">›</span>
          <span className="font-medium text-gray-800">Talents</span>
        </div>

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
              {loading ? "..." : filteredTalents.length} users
            </span>
          </div>
          <div className="flex items-center space-x-4">
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
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={handleExport}
            >
              <FolderDown size={15} />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-4 py-2">Name</th>
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
              {loading && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-purple-600">
                    Load data...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-red-500">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && filteredTalents.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    Not find data
                  </td>
                </tr>
              )}
              {!loading && !error && filteredTalents.map((talent, index) => (
                <tr key={talent.id || index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold uppercase text-xs">
                        {talent.full_name?.slice(0, 2) || "NA"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {talent.full_name || "-"}
                        </div>
                        <div className="text-xs text-gray-500">{talent.email || "-"}</div>
                      </div>
                      <div
                        className="flex items-center space-x-2 group"
                        onClick={() => handleCopyEmail(talent.email)}
                        style={cursor[0]}
                      >
                        <Copy
                          size={16}
                          className="text-gray-400 group-hover:text-purple-600 transition-colors"
                        />
                        {copy === talent.email && (
                          <span className="text-green-600 text-xs font-medium">
                            Copied!
                          </span>
                        )}
                      </div>
                      <div style={cursor[0]}>
                        <MessageCirclePlus size={16} />
                      </div>
                      <div style={cursor[0]}
                        className="flex items-center gap-1"
                        onClick={() => setActiveCommentTalent(talent.full_name)}
                      >
                        <span>{comments[talent.full_name]?.length || 0}</span>
                        <MessageCircle size={16} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">{talent.level || "-"}</td>
                  <td className="px-4 py-2">
                    {Array.isArray(talent.skills) ? talent.skills.join(", ") : talent.skills || "-"}
                  </td>
                  <td className="px-4 py-2">{talent.years_of_experience ?? "-"}</td>
                  <td className="px-4 py-2">{talent.availability || "-"}</td>
                  <td className="px-4 py-2">{talent.profile_feedback || "-"}</td>
                  <td className="px-4 py-2">{talent.partner || "-"}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      {talent.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comment Panel */}
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
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </>
              )}

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
                            <span className="text-gray-500">Expected salary</span>
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