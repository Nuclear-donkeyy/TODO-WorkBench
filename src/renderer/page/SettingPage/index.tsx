import React from 'react';
import { useTheme, ThemeType } from '../../hooks/useTheme';
import './index.less';

export default function SettingPage(): JSX.Element {
  const { theme: currentTheme, setTheme, themes } = useTheme();

  const handleThemeChange = (theme: ThemeType) => {
    setTheme(theme);
  };

  return (
    <div className='setting-page'>
      <div className='setting-page__header'>
        <h1 className='setting-page__title'>设置</h1>
        <p className='setting-page__subtitle'>个性化您的应用体验</p>
      </div>

      <div className='setting-page__content'>
        <div className='setting-section'>
          <h2 className='setting-section__title'>主题外观</h2>
          <p className='setting-section__description'>
            选择您喜欢的主题色彩，让应用更符合您的个人风格
          </p>

          <div className='theme-grid'>
            {Object.entries(themes).map(([themeKey, themeConfig]) => {
              const isSelected = currentTheme === themeKey;
              const themeType = themeKey as ThemeType;

              return (
                <div
                  key={themeKey}
                  className={`theme-card ${isSelected ? 'theme-card--selected' : ''}`}
                  onClick={() => handleThemeChange(themeType)}
                  role='button'
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleThemeChange(themeType);
                    }
                  }}
                >
                  <div className='theme-card__preview'>
                    <div
                      className='theme-card__color-primary'
                      style={{ backgroundColor: themeConfig.primaryColor }}
                    />
                    <div className='theme-card__color-pattern'>
                      <div className='color-dot color-dot--1' />
                      <div className='color-dot color-dot--2' />
                      <div className='color-dot color-dot--3' />
                    </div>
                  </div>

                  <div className='theme-card__info'>
                    <h3 className='theme-card__name'>{themeConfig.name}</h3>
                    <p className='theme-card__description'>
                      {themeConfig.description}
                    </p>
                    <div className='theme-card__badge'>
                      {themeConfig.isLight ? '🌞 亮色' : '🌙 暗色'}
                    </div>
                  </div>

                  {isSelected && (
                    <div className='theme-card__selected-indicator'>
                      <svg
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                      >
                        <path
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          fill='currentColor'
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className='setting-section'>
          <h2 className='setting-section__title'>其他设置</h2>
          <div className='setting-item'>
            <label className='setting-item__label'>
              <input type='checkbox' className='setting-item__checkbox' />
              <span className='setting-item__checkmark'></span>
              跟随系统主题
            </label>
            <p className='setting-item__description'>
              自动根据系统设置切换亮色和暗色主题
            </p>
          </div>

          <div className='setting-item'>
            <label className='setting-item__label'>
              <input type='checkbox' className='setting-item__checkbox' />
              <span className='setting-item__checkmark'></span>
              启用动画效果
            </label>
            <p className='setting-item__description'>
              显示页面切换和交互动画效果
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
