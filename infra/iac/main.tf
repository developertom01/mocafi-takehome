terraform {
  required_providers {
    linode = {
        source = "linode/linode"
    }
  }
}

provider "linode" {
  token = var.linode_token
  
}


locals { 
   region = "us-east"
   instance_label = var.instance_label
   instance_type = "g6-nanode-1" // 1 vCPU, 1GB RAM, 25GB Storage
   instance_image = "linode/ubuntu20.04"
}

resource "linode_stackscript" "start-server" {
  label = "Start Mocafi Server"
  script = file("setup.sh")
  images = [local.instance_image]
  description = "Starts the Mocafi server"


}

resource "linode_instance" "mocafi-server" {
  label = local.instance_label
  region = local.region
  root_pass = var.root_password
  type = local.instance_type
  image = local.instance_image

  stackscript_id = linode_stackscript.start-server.id
  metadata {
    user_data = base64decode(file("setup.sh"))
  }

}
