import {
    User,
    GraduationCap,
    Stethoscope,
    Briefcase,
    ClipboardList,
    MapPin,
    Upload,
    Shield,
    CheckCircle
} from 'lucide-react';
import ncahpLogo from '@/assets/ncahp-logo.png';

const sections = [
    {
        id: 1,
        title: 'Personal Information',
        tagline: 'Basic details of the applicant',
        icon: User,
        color: 'from-teal-500 to-teal-600'
    },
    {
        id: 2,
        title: 'Academic Qualification',
        tagline: 'Details of Matriculation and Senior Secondary qualification',
        icon: GraduationCap,
        color: 'from-blue-500 to-blue-600'
    },
    {
        id: 3,
        title: 'Primary Healthcare Qualifications',
        tagline: 'Essential healthcare qualifications for registration under a profession',
        icon: Stethoscope,
        color: 'from-emerald-500 to-emerald-600'
    },
    {
        id: 4,
        title: 'Internship / Clinical / Fieldwork etc.',
        tagline: 'Details of internship, clinical training, and fieldwork',
        icon: Briefcase,
        color: 'from-violet-500 to-violet-600'
    },
    {
        id: 5,
        title: 'Work Experience',
        tagline: 'Professional work history',
        icon: ClipboardList,
        color: 'from-amber-500 to-amber-600'
    },
    {
        id: 6,
        title: 'Practice Location',
        tagline: 'Details of hospital, institution, laboratory, or clinic for practice',
        icon: MapPin,
        color: 'from-rose-500 to-rose-600'
    },
    {
        id: 7,
        title: 'Uploads',
        tagline: 'Upload valid ID proof, medical fitness certificate, etc.',
        icon: Upload,
        color: 'from-cyan-500 to-cyan-600'
    },
    {
        id: 8,
        title: 'Declaration by Applicant',
        tagline: "Applicant declaration regarding filled-in form details",
        icon: Shield,
        color: 'from-indigo-500 to-indigo-600'
    },
    {
        id: 9,
        title: 'Review & Submit',
        tagline: 'Final review and submission',
        icon: CheckCircle,
        color: 'from-green-500 to-green-600'
    }
];

const AdditionalRegistration = () => {
    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/20 p-6 flex flex-col items-center overflow-hidden">
            {/* Header */}
            <header className="flex items-center gap-4 mb-6">
                <img src={ncahpLogo} alt="NCAHP" className="h-10 w-auto" />
                <div>
                    <h1 className="text-xl font-display font-semibold text-foreground">Registration Form</h1>
                    <p className="text-xs text-muted-foreground">National Commission for Allied and Healthcare Professions</p>
                </div>
            </header>

            {/* 9 Section Grid */}
            <div className="grid grid-cols-3 gap-5">
                {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                        <div
                            key={section.id}
                            className="relative bg-white rounded-2xl border border-border shadow-sm 
                         hover:shadow-lg transition-all duration-300 overflow-hidden w-80"
                        >
                            {/* Gradient Top Bar */}
                            <div className={`h-1.5 w-full bg-gradient-to-r ${section.color}`} />

                            {/* Content */}
                            <div className="p-5">
                                {/* Icon & Number */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} 
                                  flex items-center justify-center shadow-md`}>
                                        <IconComponent className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">
                                        Step {section.id}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-base font-display font-semibold text-foreground mb-1.5 leading-tight">
                                    {section.title}
                                </h3>

                                {/* Tagline */}
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                    {section.tagline}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdditionalRegistration;
