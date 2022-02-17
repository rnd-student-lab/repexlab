const template = `\
Vagrant.configure("2") do |config|
  config.vm.box = "<%- box %>"
  config.vm.box_version = "<%- box_version %>"
  config.vm.boot_timeout = <%= boot_timeout %>

  config.vm.provider "<%= provider.provider %>" do |v|
    v.memory = <%= provider.memory %>
    v.cpus = <%= provider.cpus %>

    <% for (let i in provider.customize) { %>
    v.customize [<%- provider.customize[i].join(', ') %>]
    <% } %>
  end
  config.vm.hostname = "<%= provider.hostname %>"
  config.vm.network "<%= provider.network.type %>", ip: "<%= provider.network.ip %>"

  config.vm.synced_folder ".", "/vagrant", disabled: true

  <% if (synced_folder.type == 'nfs') { %>
    config.vm.synced_folder "<%= synced_folder.from %>", "/var/nfs", :mount_options => [
      "actimeo=<%= synced_folder.mount_options.actimeo %>"
    ], type: "<%= synced_folder.type %>"
    config.bindfs.bind_folder "/var/nfs", "<%= synced_folder.to %>"
  <% } %>

  <% if (synced_folder.type == 'virtualbox') { %>
    config.vm.synced_folder "<%= synced_folder.from %>", "<%= synced_folder.to %>", :mount_options => [
      "dmode=<%= synced_folder.mount_options.dmode %>","fmode=<%= synced_folder.mount_options.fmode %>"
    ], type: "<%= synced_folder.type %>"
  <% } %>

  config.vm.provision :shell, inline: "apt update && apt install -qy ansible"
  # config.vm.provision "ansible_local" do |ansible|
  #  ansible.playbook = "/vagrant/vm/server/provision/playbook.yml"
  #  ansible.install_mode = "default"
  # end

  <% for (let i in provision) { %>
    config.vm.provision "ansible_local" do |ansible|
      ansible.playbook = "/provision/<%= i %>/<%= provision[i].file %>"
      ansible.install_mode = "default"
    end
  <% } %>
end
`;

export default template;
