import { BriefcaseMedical, UserCheck, Award, PlayCircle, ShieldUser, TruckElectric } from "lucide-react"

export default function CircleCard({ Logo, title, description }) {

 
    if (!Logo) return null

    return (
        <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-20 h-20 rounded-full bg-gray-100 border flex items-center justify-center">
                <Logo className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}

