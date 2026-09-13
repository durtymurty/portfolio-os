import { SKILLS } from "../../data";
import { AppTitle, SectionHeading, Tag } from "../ui";

const COLORS = ["#58a6ff", "#3fb950", "#d2a8ff", "#f97316", "#ff7b72", "#e3b341"];

export default function SkillsApp() {
  return (
    <div className="flex flex-col gap-5">
      <AppTitle>Skills</AppTitle>
      {SKILLS.map((group, i) => {
        const color = COLORS[i % COLORS.length];
        return (
          <section key={group.category}>
            <SectionHeading color={color}>{group.category}</SectionHeading>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <li key={skill}><Tag color={color} round>{skill}</Tag></li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
