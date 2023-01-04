import { Translations } from "./en"

const vi: Translations = {
  common: {
    paste: "Dán",
    import: "Nhập",
    continue: "Tiếp tục",
    copy: "Sao chép",
    copied: "Đã sao chép vào khay nhớ tạm",
    mainWallet: "Ví chính",
    done: "Xong",
    share: "Chia sẻ",
    max: "Tối đa",
    next: "Tiếp",
    send: "Gửi",
    from: "Từ",
    to: "Đến",
    cancel: "Hủy",
    main: "Chính",
  },
  trade: {
    networkFee: "Phí",
    maxTotal: "Tổng cộng",
  },
  welcome: {
    createNewWallet: "Tạo ví mới",
    importWallet: "Đã có ví",
  },
  navigators: {
    goBack: "Quay lại",

    screenName: {
      legal: "Pháp lý",
      setupPasscode: "Cài đặt mật khẩu",
      inputPasscode: "Nhập mật khẩu",
      createNewWallet: "Tạo ví mới",
      importWallet: "Nhập ví đã có sẵn",
      home: "Ví",
      settings: "Cài đặt",
      receive: "Nhận",
      send: "Gửi",
      sendConfirmation: "Xác nhận",
      buy: "Mua",
      manageWallet: "Quản lý ví",
      token: "Tokens",
      addCustomToken: "Thêm Token",
    },
  },
  legal: {
    message: "Please review the Sparkminds Wallet Terms of Service and Privacy Policy",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
  passcode: {
    setupPasscode: {
      step: {
        create: {
          label: "Nhập mật khẩu mới",
        },
        confirm: {
          label: "Xác nhận mật khẩu",
        },
      },
      hint: "Thêm 1 lớp bảo mật khi sử dụng ứng dụng",
    },
    wrongPasscodeMessage: "Mật khẩu sai, vui lòng nhập lại",
  },
  importWallet: {
    hint: "Nhập 12 (hoặc 24) từ cách nhau bởi dấu cách",
  },
  createNewWallet: {
    generateSecretPhrare: "Cụm từ bí mật",
    generateSecretPhrareHint:
      "Viết lại hoặc sao chép các từ này theo đúng thứ tự và lưu trữ chúng ở nơi an toàn.",
    verifySecretPhrase: "Xác thực cụm từ bí mật",
    verifySecretPhraseHint: "Chọn từng từ theo đúng thứ tự",
    secretSpecialHint:
      "KHÔNG CHIA SẺ cụm từ bí mật cho bất kì ai, ví của bạn sẽ gặp nguy hiểm vì nó chứa mọi thông tin về ví.",
  },
  home: {
    actions: {
      send: "Gửi",
      receive: "Nhận",
      buy: "Mua",
      swap: "Đổi",
    },
    tabs: {
      token: "Tokens",
      nft: "NFTs",
    },
  },
  sendResult: {
    information: {
      title: "Gửi {{token}} thành công",
      token: "Mã",
      value: "Số lượng",
      to: "Gửi đến ví",
      txnFee: "Phí giao dịch",
      txnHash: "Hash giao dịch",
      confirmations: "Xác nhận",
    },
  },
  settings: {
    wallets: "Quản lý ví",
  },
  addNewToken: {
    hint: "Mọi người đều có thể tạo 1 token, kể cả phiên bản giả mạo của những token đang hiện hữu",
  },
  scanScreen: {
    qrcode: "Quét QR Code",
  },
  input: {
    walletName: {
      label: "Tên ví",
      placeholder: "Hãy nhập một tên gợi nhớ đến ví",
    },
    secretPhrase: {
      label: "Cụm từ bí mật",
      placeholder: "Cụm từ bí mật",
    },
    search: {
      placeholder: "Tìm kiếm ở đây...",
    },
    recipientAddress: {
      label: "Địa chỉ ví người nhận",
      placeholder: "Nhập địa chỉ ví",
    },
    amount: {
      label: "Số lượng",
      placeholder: "0.00",
    },
    contractAddress: {
      label: "Địa chỉ",
      placeholder: "Địa chỉ",
    },
    name: {
      label: "Tên",
      placeholder: "Tên",
    },
    symbol: {
      label: "Mã",
      placeholder: "Mã",
    },
    decimals: {
      label: "Số thập phân",
      placeholder: "Số thập phân",
    },
  },
  errorMessage: {
    required: "{{fieldName}} là bắt buộc",
    invalid: "{{fieldName}} sai định dạng",
    unknown: "Đã xảy ra lỗi. Vui lòng thử lại.",
    mnemonicWrongOrder: "Sai thứ tự, vui lòng thử lại!",
  },
}

export default vi
