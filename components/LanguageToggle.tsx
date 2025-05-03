import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (checked: boolean) => {
    const newLang = checked ? 'en' : 'mn';
    i18n.changeLanguage(newLang); 
  };

  return (
    <div className='flex flex-row gap-4'>
      <span className='text-black font-semibold'>{i18n.language === 'mn' ? 'Монгол' : 'English'}</span>
      <Switch
        checked={i18n.language === 'en'}
        onChange={handleLanguageChange}
        checkedChildren="EN"
        unCheckedChildren="MN"
      />
    </div>
  );
};

export default LanguageToggle;