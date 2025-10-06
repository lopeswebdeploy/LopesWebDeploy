interface SectionHeaderProps {
  title: string;
  highlight: string;
  description?: string;
  centered?: boolean;
}

const SectionHeader = ({ 
  title, 
  highlight, 
  description, 
  centered = true 
}: SectionHeaderProps) => {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
        {title} <span className="text-brand-coral">{highlight}</span>
      </h2>
      {description && (
        <p className={`text-xl text-muted-foreground ${centered ? 'max-w-2xl mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
