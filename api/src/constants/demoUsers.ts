export const DemoUserType = {
  ADMIN: 'admin',
  PRODUCT_MANAGER: 'product-manager',
  DEVELOPER: 'developer',
  DESIGNER: 'designer',
} as const;

export const demoUsers = [
  {
    name: 'Lord Gaben',
    email: 'gaben@jira.guest',
    avatarUrl: 'https://i.ibb.co/6RJ5hq6/gaben.jpg',
    userType: DemoUserType.ADMIN,
    title: 'Workspace Admin',
    role: 'manager',
  },
  {
    name: 'Baby Yoda',
    email: 'yoda@jira.guest',
    avatarUrl: 'https://i.ibb.co/6n0hLML/baby-yoda.jpg',
    userType: DemoUserType.PRODUCT_MANAGER,
    title: 'Product Manager',
    role: 'manager',
  },
  {
    name: 'Pickle Rick',
    email: 'rick@jira.guest',
    avatarUrl: 'https://i.ibb.co/7JM1P2r/picke-rick.jpg',
    userType: DemoUserType.DEVELOPER,
    title: 'Software Engineer',
    role: 'member',
  },
  {
    name: 'Leia Organa',
    email: 'leia@jira.guest',
    avatarUrl: 'https://i.pravatar.cc/300?img=32',
    userType: DemoUserType.DESIGNER,
    title: 'Product Designer',
    role: 'member',
  },
] as const;
