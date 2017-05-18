export default (role) => {
  const items = [
    {text: 'Calendar', path:'/calendar'},
    {text: 'Trainers', path:'/trainers', role:'admin'},
    {text: 'Clients', path:'/clients'}
  ];
  if(role === 'admin') {
    return items;
  }
  else {
    return items.filter(x=>x.role !== 'admin')
  }
}
