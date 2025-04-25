import { Header, ChatIcon, CloseButton } from './Header-components';

function Header() {
    return (
        <Header>
        <ChatIcon>
          <span>🤖</span>
          <span>ChatBot</span>
        </ChatIcon>
        <CloseButton>×</CloseButton>
      </Header>
    )
}

export default Header;