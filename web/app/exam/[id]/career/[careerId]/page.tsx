"use client";

import { useParams, notFound } from "next/navigation";
import { useState, useMemo } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Select, SelectItem } from "@heroui/select";
import { GraduationCap, Users, BarChart3 } from "lucide-react";
import { ApplicantSearchBar } from "@/components/applicant-search-bar";
import { ApplicantCard } from "@/components/applicant-card";
import type { Career, Applicant } from "@/types/exam";

// Mock data - Replace with actual API call
const mockCareers: Record<string, Career & { applicantsList: Applicant[] }> = {
  "1-1": {
    id: "1",
    code: "001",
    name: "Administración",
    seats: 50,
    applicants: 890,
    applicantsList: [
      {
        id: "7",
        code: "733489",
        firstName: "CIELO",
        lastName: "GUTIERREZ YNUMA",
        score: 1600.45,
        admitted: true,
      },
      {
        id: "2",
        code: "585182",
        firstName: "LISBETH",
        lastName: "APONTE",
        score: 1230.55,
        admitted: true,
      },
      {
        id: "3",
        code: "556362",
        firstName: "SUNEI",
        lastName: "CANAQUIRI",
        score: 1000.0,
        admitted: false,
      },
      {
        id: "1",
        code: "556601",
        firstName: "ANDY",
        lastName: "ANGULO TAZA",
        score: 755.125,
        admitted: false,
      },
      {
        id: "5",
        code: "556263",
        firstName: "CRISTIAN",
        lastName: "FERNANDEZ",
        score: 450.0,
        admitted: false,
      },
      {
        id: "4",
        code: "560156",
        firstName: "ABEL",
        lastName: "CHÁVEZ ARRATEA",
        score: 120.304,
        admitted: false,
      },
      {
        id: "6",
        code: "578433",
        firstName: "ROY",
        lastName: "FRANCO GARCIA",
        score: 0.0,
        admitted: false,
      },
    ],
  },
  "1-7": {
    id: "7",
    code: "007",
    name: "Computación Científica",
    seats: 45,
    applicants: 1200,
    applicantsList: [
      {
        id: "1",
        code: "2024A1B2",
        firstName: "JUAN",
        lastName: "QUISPE",
        score: 1450.0,
        admitted: true,
      },
      {
        id: "2",
        code: "2024C3D4",
        firstName: "MARIA",
        lastName: "FLORES",
        score: 1120.0,
        admitted: false,
      },
      {
        id: "3",
        code: "2024E5F6",
        firstName: "CARLOS",
        lastName: "ROJAS",
        score: 1380.0,
        admitted: true,
      },
      {
        id: "4",
        code: "2024G7H8",
        firstName: "SOFIA",
        lastName: "MAMANI",
        score: 1210.0,
        admitted: false,
      },
    ],
  },
  "2-5": {
    id: "5",
    code: "005",
    name: "Ingeniería de Sistemas",
    seats: 90,
    applicants: 2100,
    applicantsList: [
      {
        id: "1",
        code: "UNI2024001",
        firstName: "DIEGO",
        lastName: "MARTINEZ LOPEZ",
        score: 1850.5,
        admitted: true,
      },
      {
        id: "2",
        code: "UNI2024002",
        firstName: "ANA",
        lastName: "GARCIA PEREZ",
        score: 1720.25,
        admitted: true,
      },
      {
        id: "3",
        code: "UNI2024003",
        firstName: "LUIS",
        lastName: "RODRIGUEZ",
        score: 1650.0,
        admitted: true,
      },
    ],
  },
};

export default function CareerDetailPage() {
  const params = useParams();
  const examId = params.id as string;
  const careerId = params.careerId as string;
  const careerKey = `${examId}-${careerId}`;

  const career = mockCareers[careerKey];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("postulantes");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [selectedModality, setSelectedModality] = useState("all");

  const filteredApplicants = useMemo(() => {
    if (!career?.applicantsList) return [];

    if (!searchQuery.trim()) {
      return career.applicantsList;
    }

    const query = searchQuery.toLowerCase();
    return career.applicantsList.filter(
      (applicant) =>
        applicant.code.toLowerCase().includes(query) ||
        applicant.firstName.toLowerCase().includes(query) ||
        applicant.lastName.toLowerCase().includes(query) ||
        `${applicant.firstName} ${applicant.lastName}`
          .toLowerCase()
          .includes(query)
    );
  }, [career, searchQuery]);

  if (!career) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Career Header Card */}
      <Card shadow="sm">
        <CardBody className="gap-4 p-6">
          <div className="flex items-start gap-4">
            <Avatar
              icon={<GraduationCap className="h-6 w-6" />}
              classNames={{
                base: "bg-primary-100 dark:bg-primary-900/20",
                icon: "text-primary",
              }}
              size="lg"
              className="flex-shrink-0"
            />
            <div className="flex flex-1 flex-col gap-2">
              <h2 className="text-xl font-bold sm:text-2xl">{career.name}</h2>
              <p className="text-base text-default-600">Admisión 2025-1</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          label="Sede"
          placeholder="TODOS"
          selectedKeys={[selectedCampus]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setSelectedCampus(value);
          }}
          size="md"
          variant="flat"
          classNames={{
            base: "flex-1",
          }}
        >
          <SelectItem key="all">TODOS</SelectItem>
          <SelectItem key="lima">Lima</SelectItem>
          <SelectItem key="provincial">Provincial</SelectItem>
        </Select>

        <Select
          label="Modalidad"
          placeholder="TODOS"
          selectedKeys={[selectedModality]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setSelectedModality(value);
          }}
          size="md"
          variant="flat"
          classNames={{
            base: "flex-1",
          }}
        >
          <SelectItem key="all">TODOS</SelectItem>
          <SelectItem key="ordinary">Ordinario</SelectItem>
          <SelectItem key="extraordinary">Extraordinario</SelectItem>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs
        aria-label="Career options"
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        color="primary"
        variant="solid"
        fullWidth
        classNames={{
          base: "w-full",
          tabList: "gap-2 w-full bg-default-100 p-1",
          tab: "h-12",
          cursor: "bg-primary",
          tabContent: "group-data-[selected=true]:text-white",
        }}
      >
        <Tab
          key="postulantes"
          title={
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>postulantes</span>
            </div>
          }
        >
          <div className="flex flex-col gap-4 py-4">
            <ApplicantSearchBar onSearch={setSearchQuery} />

            <div className="flex flex-col gap-3">
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((applicant) => (
                  <ApplicantCard
                    key={applicant.id}
                    applicant={applicant}
                    examId={examId}
                    careerId={careerId}
                  />
                ))
              ) : (
                <div className="py-8 text-center text-default-500">
                  No se encontraron postulantes
                </div>
              )}
            </div>
          </div>
        </Tab>

        <Tab
          key="estadisticas"
          title={
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span>estadísticas</span>
            </div>
          }
        >
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <p className="text-default-500">
              Estadísticas próximamente disponibles
            </p>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
