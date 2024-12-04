model
  schema 1.1

type user

type catalog_entity
  relations
    define owner: [user]
    define viewer: [user]
    define catalog_entity_read: viewer or owner
    define catalog_entity_delete: owner
