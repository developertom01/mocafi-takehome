variable "root_password" {
  type = string
  description = "The root password for the Linode instance"
  sensitive = true
}
variable "linode_token" {
  type = string
  description = "The Linode API token"
  sensitive = true
}

variable "db_connection_string" {
  type = string
  description = "The connection string for the database"
  sensitive = true
}

variable "database_name" {
    type = string
    description = "The name of the database"
}

variable "app_secret" {
    type = string
    description = "The secret for the app"
    sensitive = true
}

variable "app_port" {
    type = number
    description = "The port for the app"
}

variable "database_secret" {
    type = string
    description = "The secret for the database"
    sensitive = true
}

variable "mongo_vault_namespace"  {
    type = string
    description = "The namespace for the mongo vault"
    sensitive = true
}
