import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '../Header'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { Preferences } from '@/app/PreferenceProvider'
import { ThemeProvider } from '@mui/material'
import { lightTheme } from '@/theme/theme'

// 模拟 ToolbarTooltip 组件
jest.mock('../ToolbarTooltip', () => ({
  ToolbarTooltip: ({ title, children }: any) => (
    <div title={title}>{children}</div>
  ),
}))

describe('Header', () => {
  const mockSetValue = jest.fn()
  const editor = withHistory(withReact(createEditor()))
  const preferences = {
    prefersDarkMode: false,
    setPrefersDarkMode: jest.fn(),
  }

  const renderHeader = () => {
    return render(
      <Preferences.Provider value={preferences}>
        <ThemeProvider theme={lightTheme}>
          <Header editor={editor} setValue={mockSetValue} />
        </ThemeProvider>
      </Preferences.Provider>
    )
  }

  it('renders file operation buttons', () => {
    renderHeader()
    expect(screen.getByText('打开')).toBeInTheDocument()
    expect(screen.getByText('保存')).toBeInTheDocument()
  })

  it('renders formatting buttons', () => {
    renderHeader()
    expect(screen.getByTitle('加粗')).toBeInTheDocument()
    expect(screen.getByTitle('斜体')).toBeInTheDocument()
    expect(screen.getByTitle('下划线')).toBeInTheDocument()
  })

  it('toggles theme mode when switch is clicked', () => {
    renderHeader()
    const themeSwitch = screen.getByRole('checkbox')
    fireEvent.click(themeSwitch)
    expect(preferences.setPrefersDarkMode).toHaveBeenCalled()
  })
}) 