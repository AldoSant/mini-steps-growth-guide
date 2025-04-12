
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface ProfileDevelopmentChartProps {
  motorValue: number;
  cognitiveValue: number;
  socialValue: number;
  languageValue: number;
}

const ProfileDevelopmentChart = ({
  motorValue,
  cognitiveValue,
  socialValue,
  languageValue
}: ProfileDevelopmentChartProps) => {
  // Prepare data for radar chart
  const data = [
    { skill: 'Motor', value: motorValue },
    { skill: 'Cognitivo', value: cognitiveValue },
    { skill: 'Social', value: socialValue },
    { skill: 'Linguagem', value: languageValue },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <Radar
            name="Habilidades"
            dataKey="value"
            stroke="#7c3aed"
            fill="#7c3aed"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfileDevelopmentChart;
